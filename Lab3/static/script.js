const map = L.map('map').setView([51.0447, -114.0719], 11);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: '© Esri'
}).addTo(map);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    opacity: 1
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
                        <b style="color:#0ed7ed; font-size:15px;">Building Permit</b><hr style="border-color:#ed9b0e;">
                        <b>Date:</b> ${feature.properties.issueddate?.substring(0,10) || 'N/A'}<br>
                        <b>Work Class:</b> ${feature.properties.workclassgroup || 'N/A'}<br>
                        <b>Contractor:</b> ${feature.properties.contractorname || 'N/A'}<br>
                        <b>Community:</b> ${feature.properties.communityname || 'N/A'}<br>
                        <b>Address:</b> ${feature.properties.originaladdress || 'N/A'}
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