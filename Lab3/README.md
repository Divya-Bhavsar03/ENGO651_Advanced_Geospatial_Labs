# ENGO 651 Lab 3: Calgary Building Permit Search

## Overview
This is a single-page web mapping application that allows users to filter and visualize building permits issued in the City of Calgary. It connects a Python (Flask) backend to the Open Calgary API and displays the resulting GeoJSON data on a frontend map using Leaflet.js.

## Features Included
* **Date Range Search:** Users can query the Open Calgary dataset for permits issued between specific start and end dates.
* **Interactive Map:** Built with Leaflet.js and ESRI imagery base tiles.
* **Marker Clustering:** Uses the `Leaflet.markercluster` plug-in to group data points at higher zoom levels, keeping the map visually clean.
* **Spiderfying Overlapping Markers:** Uses the `OverlappingMarkerSpiderfier` plug-in to fan out markers that share the exact same geographical coordinates.
* **Detailed Pop-ups:** Clicking a marker reveals the permit's Issue Date, Work Class, Contractor, Community, and original address.

## Technologies Used
* **Frontend:** HTML, CSS, JavaScript, Leaflet.js
* **Backend:** Python, Flask, Requests
* **Data Source:** Open Calgary API

# Student Name:
**Divya Bhavsar**  
*MEng Geomatics Engineering*  
*University of Calgary*