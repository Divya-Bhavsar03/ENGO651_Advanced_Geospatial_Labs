# IoT Web Map Application (ENGO 651 - Lab 5)

This is the code for Lab 5. This app uses the **MQTT protocol** to share real-time location and temperature data and displays it on an interactive map.

## Live Demo
The application is hosted online using GitHub Pages. 
You can access it here: [Live Web App](https://Divya-Bhavsar03.github.io/ENGO651_Advanced_Geospatial_Labs/Lab5/)

---

## Features

- **MQTT Connection:** Connects securely to the public `test.mosquitto.org` broker using WebSockets over port 8081.
- **Auto-Reconnect:** Detects when the internet connection is lost and automatically attempts to reconnect every 3 seconds.
- **Location Sharing:** Uses the browser's Geolocation API to find the user's real coordinates.
- **Data Simulation:** Generates a random temperature value between -40°C and 60°C.
- **GeoJSON Formatting:** Packages the location and temperature data into a standard GeoJSON format before publishing.
- **Live Map Updates:** Subscribes to the MQTT topic (`ENGO651/Divya_Bhavsar/my_temperature`) and automatically moves the map marker when a new message arrives.
- **Custom Topic Publishing:** Allows users to type any topic and message to test standard MQTT publishing.

---

## Temperature Color Logic

The application reads the temperature from the incoming MQTT message and changes the marker color on the map automatically. 

| Temperature Range | Marker Color | Description |
| :--- | :--- | :--- |
| Less than 10°C | **Blue** | Cold temperatures |
| 10°C to 29.9°C | **Green** | Moderate temperatures |
| 30°C to 60°C | **Red** | Hot temperatures |

---

## Technologies Used

- **HTML/CSS:** For building the user interface and layout.
- **JavaScript:** For the core logic, connection handling, and data processing.
- **Leaflet.js:** An open-source JavaScript library used to display the interactive map and markers.
- **Paho MQTT Client:** A JavaScript library used to establish the WebSocket connection to the MQTT broker.

---

## How to Use the Application

1. **Open the App:** Go to the live demo link on your smartphone or computer.
2. **Connect:** Click the **Start** button. The status text will change to "Connected". The inputs will lock.
3. **Share Data:** Click the **Share my status** button. The app will ask for location permission. Once granted, it will send your data to the server.
4. **View Map:** The map will jump to your current location. Click the colored circle marker to see a popup with the topic name and temperature.
5. **Test Custom Messages:** Scroll to the bottom, enter a custom topic (e.g., `test/hi`) and a message, then click **Publish**. 
6. **Disconnect:** Click the **End** button to close the connection to the server.

## Name: Divya Bhavsar  
### MEng Geomatics Engineering, University of Calgary