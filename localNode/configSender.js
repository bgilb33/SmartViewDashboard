const mqtt = require('mqtt');
const readline = require('readline');

const fs = require('fs')
const protocol = 'mqtts'
// Set the host and port based on the connection information.
const host = 'u88196e4.ala.us-east-1.emqxsl.com'
const port = '8883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `${protocol}://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'mqttservice',
  password: 'password3',
  reconnectPeriod: 1000,
  // If the server is using a self-signed certificate, you need to pass the CA.
  ca: fs.readFileSync('./broker.emqx.io-ca.crt'),
})


// (4) nialab/CONFIG <DeviceID> <Frequency> <Units>
const configMessage = "9 60 Minute";

// (5) nialab//STATUS/OUT STATUS
const statusOutMessage = "STATUS";

// Topic Information: Here the lab will be combined with the topic part to create the complete topic
const labName = "nialab" ; // Change this if you want to change labs

function sendMQTTConfigMessage(lab, deviceID, Frequency, Units){
    message = deviceID.toString() + " " + Frequency.toString() + " " + Units;


    topic = lab + "/CONFIG"
    // Publish the user's message to a topic
    client.publish(topic, message, (err) => {
    if (!err) {
        console.log(`Published message to ${topic}: ${message}`);
    } else {
        console.error(`Error publishing message: ${err}`);
    }

    console.log();
    });
}

function sendMQTTStatusMessage(lab){
    topic = lab + "/STATUS/OUT"
    // Publish the user's message to a topic
    client.publish(topic, statusOutMessage, (err) => {
    if (!err) {
        console.log(`Published message to ${topic}: ${statusOutMessage}`);
    } else {
        console.error(`Error publishing message: ${err}`);
    }

    console.log();
    });
}

// example calls
sendMQTTStatusMessage("nialab");
sendMQTTConfigMessage("nialab", 9,10,"Minute");



// Handle connection event
client.on('connect', () => {
  console.clear();
  // console.log('Sender connected to MQTT broker');
});


// Handle error event
client.on('error', (error) => {
    console.error(`Error: ${error}`);
});
