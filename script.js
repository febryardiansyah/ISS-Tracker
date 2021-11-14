let latitudeText = document.querySelector('.latitude');
let longitudeText = document.querySelector('.longitude');
let timeText = document.querySelector('.time');
let speedText = document.querySelector('.speed');
let altitudeText = document.querySelector('.altitude');
let visibilityText = document.querySelector('.visibility');

let myLatitudeText = document.querySelector('.my-latitude');
let myLongitudeText = document.querySelector('.my-longitude');
let myTimeText = document.querySelector('.my-time');

let lat = 51.505;
let long = -0.09;
let zoomLevel = 5;

const map = L.map('map-div').setView([51.505, -0.09], zoomLevel)

navigator.geolocation.getCurrentPosition((position) => {
    myLatitudeText.innerText = position.coords.latitude.toFixed(2);
    myLongitudeText.innerText = position.coords.longitude.toFixed(2);
    myTimeText.innerText = new Date(position.timestamp);
    const myMarker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
    myMarker.bindPopup("You're here").openPopup();
});

const icon = L.icon({
    iconUrl: './img/iss.png',
    iconSize: [90, 45],
    iconAnchor: [25, 94],
    popupAnchor: [20, -86]
})

const marker = L.marker([lat, long], { icon: icon }).addTo(map);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZmVicnk2OSIsImEiOiJja3Z5cjlqMGswam41Mm5vYnNkNWJ4YWFpIn0.VcEPoNQeZujHJBFc_yaCZQ'
}).addTo(map);

function findISS() {
    fetch('https://api.wheretheiss.at/v1/satellites/25544')
        .then(res => res.json())
        .then(data => {
            console.log(data.altitude.toFixed(2));
            lat = data.latitude.toFixed(3);
            long = data.longitude.toFixed(3);

            const timestamp = new Date(data.timestamp * 1000).toUTCString();
            const speed = data.velocity;
            const altitude = data.altitude.toFixed(2);
            const visibility = data.visibility;
            updateISS(lat, long, timestamp, speed, altitude, visibility);
        }).catch(err => console.log(err));
}

function updateISS(lat, long, timestamp, speed, altitude, visibility) {
    latitudeText.innerText = lat;
    longitudeText.innerText = long;
    timeText.innerText = timestamp;
    speedText.innerText = `${speed} km/hr`;
    altitudeText.innerText = `${altitude} km`;
    visibilityText.innerText = visibility;

    marker.setLatLng([lat, long]);
    map.setView([lat, long]);
}

findISS();
setInterval(findISS, 1000)