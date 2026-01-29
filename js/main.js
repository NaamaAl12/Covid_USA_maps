mapboxgl.accessToken =
  "pk.eyJ1IjoibmFsMTIiLCJhIjoiY21reXBkYmxtMDltbDNyb2NmcjZpaDdvdiJ9.ZX7GLNtaTYyTjLOhx4ITqg";

let map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  zoom: 3,
  minZoom: 2,
  center: [-96, 37],
  projection: "albers"
});


const grades = [10000, 50000, 100000],
  colors = ["rgb(254,229,217)", "rgb(252,146,114)", "rgb(222,45,38)"],
  radii = [6, 16, 26];

map.on("load", () => {
  map.addSource("covid-counts", {
    type: "geojson",
    data: "assets/us-covid-2020-counts.geojson"
  });

  map.addLayer({
    id: "covid-circles",
    type: "circle",
    source: "covid-counts",
    paint: {
      "circle-radius": {
        property: "cases",
        stops: [
          [grades[0], radii[0]],
          [grades[1], radii[1]],
          [grades[2], radii[2]]
        ]
      },
      "circle-color": {
        property: "cases",
        stops: [
          [grades[0], colors[0]],
          [grades[1], colors[1]],
          [grades[2], colors[2]]
        ]
      },
      "circle-stroke-color": "white",
      "circle-stroke-width": 1,
      "circle-opacity": 0.6
    }
  });

  
  map.on("click", "covid-circles", (event) => {
    const p = event.features[0].properties;

    new mapboxgl.Popup()
      .setLngLat(event.lngLat)
      .setHTML(
        `<strong>${p.county}, ${p.state}</strong><br>
         <strong>Cases:</strong> ${Number(p.cases).toLocaleString()}<br>
         <strong>Deaths:</strong> ${Number(p.deaths).toLocaleString()}`
      )
      .addTo(map);
  });
});


const legend = document.getElementById("legend");
var labels = ['<strong>Cases</strong>'],
  vbreak;

for (var i = 0; i < grades.length; i++) {
  vbreak = grades[i];
  const dot_radii = 2 * radii[i];

  labels.push(
    '<p class="break"><i class="dot" style="background:' +
      colors[i] +
      "; width: " +
      dot_radii +
      "px; height: " +
      dot_radii +
      'px;"></i> <span class="dot-label" style="top:' +
      dot_radii / 2 +
      'px;">' +
      vbreak.toLocaleString() +
      "</span></p>"
  );
}

legend.innerHTML =
  labels.join("") +
  '<p style="text-align:right;font-size:10pt">Source: <a href="https://www.nytimes.com/interactive/2021/us/covid-cases.html">NYT</a></p>';