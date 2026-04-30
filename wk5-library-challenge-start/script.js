(function () {
    'use strict';

    // add your script here
    const map = L.map('map').setView([34.0312, -118.7882], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([34.025, -118.78]).addTo(map)
        .bindPopup('Zuma Beach - where I spent much of my childhood')
        .openPopup();

    L.marker([34.0156, -118.8225]).addTo(map)
        .bindPopup('My childhood home #2')
        .openPopup();

    L.marker([34.0369, -118.6856]).addTo(map)
        .bindPopup('My childhood home #1')
        .openPopup();

}());