(function() {
    const lat = document.querySelector('#lat').value || 13.701205;
    const lng = document.querySelector('#lng').value || -89.2245333;
    const map = L.map('map').setView([lat, lng ], 16);
    let marker;
    

    //Use Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //Pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(map)

    //Get pin information
    marker.on('moveend', function(e){
        marker = e.target
        const position = marker.getLatLng();
        map.panTo(new L.LatLng(position.lat, position.lng))

        //Get street information
        geocodeService.reverse().latlng(position, 10).run(function(error, result) {
            console.log(result)

            marker.bindPopup(result.address.LongLabel)

            document.querySelector('.street').textContent = result?.address?.Address ?? '';
            document.querySelector('#street').value = result?.address?.Address ?? '';
            document.querySelector('#lat').value = result?.latlng?.lat ?? '';
            document.querySelector('#lng').value = result?.latlng?.lng ?? '';
        })

        
    })


})()