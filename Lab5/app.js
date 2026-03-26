var map = L.map('map').setView([51.0447, -114.0719], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
    referrerPolicy: 'strict-origin-when-cross-origin'
}).addTo(map);

var myMarker = null;


// for holding MQTT connection object.
var mqttClient;

var myTopic = "ENGO651/Divya_Bhavsar/my_temperature"; 

var hostInput = document.getElementById("hostInput");
var portInput = document.getElementById("portInput");
var startBtn = document.getElementById("startBtn");
var endBtn = document.getElementById("endBtn");
var shareBtn = document.getElementById("shareBtn");
var statusMessage = document.getElementById("statusMessage");

startBtn.addEventListener("click", connectToBroker);
endBtn.addEventListener("click", disconnectFromBroker);

// Function to start the connection when the Start button is clicked
function connectToBroker() {
    // Read values from my text boxes
    var host = hostInput.value;
    var port = Number(portInput.value);

    // Create a random Client ID to avoid conflicts with other users on the public server
    var clientID = "client-" + Math.random().toString(36).substring(7);

    statusMessage.innerText = "Status: Connecting...";

    // Initialize the Paho MQTT client
    mqttClient = new Paho.MQTT.Client(host, port, clientID);

    mqttClient.onConnectionLost = onConnectionLost;
    mqttClient.onMessageArrived = onMessageArrived; 

    // Try to connect, and specify what to do on success or failure
    mqttClient.connect({
        onSuccess: onConnect,
        onFailure: onFail
    });
}

// When Connection is successful
function onConnect() {
    statusMessage.innerText = "Status: Connected to " + hostInput.value;

    // Lock the inputs and Start button
    hostInput.disabled = true;
    portInput.disabled = true;
    startBtn.disabled = true;

    // Unlock the End and Share buttons
    endBtn.disabled = false;
    shareBtn.disabled = false;

    // Subscribe to topic immediately
    mqttClient.subscribe(myTopic);
    console.log("Subscribed to topic: " + myTopic);
}

// Function that runs if the initial connection attempt fails
function onFail(error) {
    statusMessage.innerText = "Status: Connection failed (" + error.errorMessage + ")";
}

// When the End button is clicked
function disconnectFromBroker() {
    mqttClient.disconnect();
    
    statusMessage.innerText = "Status: Disconnected";

    // Unlock inputs and Start button, lock End and Share buttons
    hostInput.disabled = false;
    portInput.disabled = false;
    startBtn.disabled = false;
    endBtn.disabled = true;
    shareBtn.disabled = true;
}

// Function that runs if the network drops unexpectedly
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        statusMessage.innerText = "Status: Connection lost. Reconnecting in 3 seconds...";
        
        setTimeout(connectToBroker, 3000);
        
        shareBtn.disabled = true;
    }
}

function onMessageArrived(message) {
    console.log("New message arrived on topic: " + message.destinationName);
    console.log("Message content: " + message.payloadString);
}

shareBtn.addEventListener("click", shareStatus);

function shareStatus() {
    //Check if the browser supports GPS location
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return; // Stop the function here if it's not supported
    }

    //Ask the browser for the current location
    navigator.geolocation.getCurrentPosition(
        // This success part runs if it successfully finds location
        function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            // Generate a random temperature between -40 and 60
            var randomTemp = (Math.random() * 100) - 40;
            
            // Round the temperature to 1 decimal place 
            var finalTemp = Number(randomTemp.toFixed(1));

            // Create the GeoJSON object
            var geoJSONMessage = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lng, lat] 
                },
                "properties": {
                    "temperature": finalTemp
                }
            };

            var payloadString = JSON.stringify(geoJSONMessage);

            // Create the MQTT message and prepare it for sending
            var message = new Paho.MQTT.Message(payloadString);
            
            // Tell the message exactly which topic to go to
            message.destinationName = myTopic;

            // send the message to the broker
            mqttClient.send(message);

            // Print to the console
            console.log("Just published this message: " + payloadString);
        },
        
        // This error part runs if the user blocks location access
        function(error) {
            alert("Error getting location. Please allow location permissions in your browser.");
        }
    );
}