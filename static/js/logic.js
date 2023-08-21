// GeoJSON url
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Initialize map
let map = L.map("map", 
{
    center: [37.0902, -110.7129],
    zoom: 5
});

// Add tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution:`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}).addTo(map)

// Set up the style for map
function mapStyle(feature) {
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: mapColors(feature.geometry.coordinates[2]),
        color: "black",
        radius: mapRadius(feature.properties.mag),
        stroke: true,
        weight: 0.4
    };

};

// get data with d3

d3.json(url).then(data =>

{
    console.log(data);

    // Add markers to map
    L.geoJSON(data,
        {
            onEachFeature:popUps,
            pointToLayer:markers
        })
    .addTo(map)

    function markers(feature,latlng)
    {
        let mag = feature.properties.mag*5
        let depth = feature.geometry.coordinates[2]
        return L.circleMarker(latlng,
            {
                // Circle radius based on earthqake magnitude
                radius:mag,

                // Circle fillColor based on earthquake depth
                fillColor: getColor(depth),
                
                color: "#000",
                weight: 0.25,
                opacity: 1,
                fillOpacity: 1
            })
    }
    // popups for additional info 
    function popUps(feature,layer)
    {
        let mag = feature.properties.mag
        let place = feature.properties.place
        let coord = feature.geometry.coordinates[2]
        let time = (new Date(feature.properties.time))
        layer.bindPopup(`<text><b>Magnitude</b>: ${mag}</text><br>
                         <text><b>Location</b>: ${place}</text><br>
                         <text><b>Depth</b>: ${coord}km</text><br>
                         <text><b>Time</b>: ${time}`)
    }

    // circle colors
    function getColor(d)
    {
        return d > 90 ? '#ff0000' :
               d > 70 ? '#FF5C14' :
               d > 50 ? '#ed821c' :
               d > 30 ? '#f7d21b' :
               d > 10 ? '#90EE90' :
               d > -10 ? '#1FD224' : '#FFEDA0'
    }

    // legend creation
    let legend = L.control({position:"bottomright"});
    legend.onAdd = function()
    {
        let div = L.DomUtil.create("div","info legend"),

        // range
        depth = ["-10-10","10-30","30-50","50-70","70-90","90+"]
        let colors = 
        [
            "background:#1FD224",
            "background:#90EE90",
            "background:#f7d21b",
            "background:#ed821c",
            "background:#e8510e",
            "background:#FF0000"
        ]

        for (const i in depth)
        {
            div.innerHTML += `<i style=${colors[i]}></i>${depth[i]}<br>`
        }

        return div
    }

    // Add legend to map
    legend.addTo(map);

})