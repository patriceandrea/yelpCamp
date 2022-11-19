
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({

  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/outdoors-v10', // style URL
  center: JSON.parse(campground).geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
  projection: 'globe' // display the map as a 3D globe
});

map.on('style.load', () => {
  map.setFog({}); // Set the default atmosphere style
  new mapboxgl.Marker()
    .setLngLat(JSON.parse(campground).geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(
          `<h3>${JSON.parse(campground).title}</h3><p>${JSON.parse(campground).location}</p>`
        )
    )
    .addTo(map);
});