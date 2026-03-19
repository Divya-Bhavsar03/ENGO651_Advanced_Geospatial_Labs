# Calgary Data Explorer - Lab 4

A web-based GIS application for visualizing Calgary's building permits and 2017 traffic incidents using Leaflet.js and Mapbox.

## Features

### Building Permits Visualization (Lab 3)
- Search and display building permits by date range
- Interactive markers with detailed permit information
- Marker clustering for better performance with large datasets
- Overlapping marker spiderfier for closely positioned permits
- Popup information includes:
  - Issue date
  - Work class
  - Contractor name
  - Community name
  - Address

### Traffic Incidents Layer (Lab 4)
- Toggle visualization of 2017 traffic incidents across Calgary
- Professional map design with optimized visual properties
- Seamlessly integrates with OpenStreetMap base layer

## Design Choices

The traffic incidents layer was designed with the following considerations:

- **Radius**: 4.5px - Provides clear visibility without excessive overlap
- **Color**: Red (#FF3333) - Universal indicator for incidents and danger
- **Opacity**: 0.65 - Allows overlapping incidents to show density patterns
- **Blur**: 0px - Sharp, precise circles for accurate location representation
- **Stroke**: 0.3px - Subtle definition to help dots stand out against the base map
- **Base Map**: Mapbox Standard - Provides geographic context with street names and neighborhoods

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: 
  - Leaflet.js (mapping library)
  - Mapbox GL JS (vector tiles)
  - Leaflet.markercluster (marker clustering)
  - OverlappingMarkerSpiderfier (overlapping marker handling)
- **Data Sources**:
  - Calgary Open Data Portal (building permits)
  - Mapbox (traffic incidents tileset, base maps)

- **Developer**: Divya Bhavsar  
- **Course**: ENGO651 - Advanced Geospatial Topics  
- MEng Geomatics Engineering, University of Calgary