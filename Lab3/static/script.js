const map = L.map('map').setView([51.0447, -114.0719], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const markersGroup = L.markerClusterGroup(); 
const oms = new OverlappingMarkerSpiderfier(map);

document.getElementById('searchBtn').addEventListener('click', function() {
    
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    if (!start || !end) {
        alert("Please select both a start and end date.");
        return;
    }

    markersGroup.clearLayers();
    oms.clearMarkers();

    document.getElementById('loadingOverlay').classList.add('active');

    fetch(`/api/permits?start=${start}&end=${end}`)
        .then(response => response.json()) 
        .then(data => {
            
            const geoJsonLayer = L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    
                    const popupText = `
                        <b>Issue Date:</b> ${feature.properties.issueddate}<br>
                        <b>Work Class:</b> ${feature.properties.workclassgroup}<br>
                        <b>Contractor:</b> ${feature.properties.contractorname || 'N/A'}<br>
                        <b>Community:</b> ${feature.properties.communityname}<br>
                        <b>Address:</b> ${feature.properties.originaladdress}
                    `;
                    
                    layer.bindPopup(popupText);
                    
                    oms.addMarker(layer);
                }
            });

            markersGroup.addLayer(geoJsonLayer);
            map.addLayer(markersGroup);
            
            if (markersGroup.getLayers().length > 0) {
                map.fitBounds(markersGroup.getBounds());
            } else {
                alert("No building permits found for those dates.");
            }
            
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            document.getElementById('loadingOverlay').classList.remove('active');
        });
});