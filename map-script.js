var ourLat,
    ourLon,
    dataStore = [],
    map = L.map('map');

navigator.geolocation.getCurrentPosition(function(position) {

    document.getElementById('lat').innerHTML = "Latitude: " + position.coords.latitude;
    document.getElementById('lon').innerHTML ="Longitude: " + position.coords.longitude;

    ourLat = position.coords.latitude;
    ourLon = position.coords.longitude;
    dataStore.push({lat: ourLat, lon: ourLon});
    for(var i = 0; i<10; i++){
        dataStore.push({lat:(ourLat+0.1), lon:((ourLon+0.1)*i)});
    }
    console.log(ourLat, "\n", ourLon, "\n", dataStore);
    map.setView([ourLat, ourLon], 15);

    var circle = L.circle([ourLat,ourLon], 20, { // Your location
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
    }).addTo(map);
    ducksOnMap(dataStore);

});

// var map = L.map('map').setView([51.505, -0.09], 13);



L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'minaorangina.4b7af5fd',
    accessToken: 'pk.eyJ1IjoibWluYW9yYW5naW5hIiwiYSI6ImEzZjg0YTFmZDQyOWJjZWUzNTUzZWZjMWExZDY1MTUxIn0.fLBy0l7Add3vACuMZH_iFA'
}).addTo(map);

function ducksOnMap(array){

    var quackIcon = L.icon({
        iconUrl: 'duck.gif',
        iconSize:     [40, 40], // Width, Height
        iconAnchor:   [20, 40], // WidthAnc should be about 0.5% and heighAnc about the same as height
    });


    for (var i = 0; i < array.length; i++){
        //console.log(array[i]);
        var marker = L.marker([array[i].lat, array[i].lon],{icon: quackIcon}).addTo(map);
    }

}


// var circle = L.circle([51.508, -0.11], 500, {
//     color: 'blue',
//     fillColor: '#96DEFF',
//     fillOpacity: 0.5
// }).addTo(map);

// var polygon = L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],
//     [51.51, -0.047]
// ]).addTo(map);

// //clickable popups bound to an object
// marker.bindPopup("<b>Hello world!</b><br>I am a popup.");//.openPopup();
// circle.bindPopup("I am a circle.");
// polygon.bindPopup("I am a polygon.");

// //standalone popup
// var popup = L.popup()
//     .setLatLng([51.5, -0.09])
//     .setContent("#FAC5")
//     .openOn(map);

// var marker = L.marker([51.5, -0.09]).addTo(map);
