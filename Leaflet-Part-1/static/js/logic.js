let quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


let terrain = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

function quakeSize(magnitude) {
    return magnitude * 6;
};

function quakeColor(depth) {
    if (depth > 90) {
        return "#ff5f65"
    }
    else if (depth > 70) {
        return "#fca35d"
    }
    else if (depth > 50) {
        return "#fdb72a"
    }
    else if (depth > 30) {
        return "#f7db11"
    }
    else if (depth > 10) {
        return "#dcf400"
    }
    else {
        return "#a3f600"
    }
};

d3.json(quakeUrl).then(function (quakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}
        </h3><hr><p>Date: ${new Date(feature.properties.time)}
        </p><p>Magnitude: ${feature.properties.mag}
        </p><p>Depth: ${feature.geometry.coordinates[2]} km
        </p><p>Last Updated: ${new Date(feature.properties.updated)}
        </p>`);
    }

    var quakes = L.geoJSON(quakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: quakeSize(feature.properties.mag),
                fillColor: quakeColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.75,
                color: "black",
                weight: 0.5
            });
        },
        onEachFeature: onEachFeature
    });

    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [terrain, quakes]
    });

    let baseMaps = {
        "Terrain": terrain
    };

    let overlayMaps = {
        "Earthquakes": quakes
    };

    quakes.addTo(myMap);


    
    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "legend");
        let limits = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
        let colors = ["#a3f600", "#dcf400", "#f7db11", "#fdb72a", "#fca35d", "#ff5f65"];
        let labels = [];
        let legendInfo = "<p><b>Earthquake Depth</b></p>";
    
        for (let i = 0; i < limits.length; i++) {
            labels.push(`<p><span class='square' style='background-color: ${colors[i]}'></span>&nbsp${limits[i]}&nbspkm</p>`);
        }
    
        div.innerHTML = legendInfo;
        div.innerHTML += "<p class='legtext'>" + labels.join("") + "</p>";
    
        return div;
    };
    
    legend.addTo(myMap);
    
});
