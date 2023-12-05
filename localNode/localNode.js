const { testAddData, testGetDevice } = require('./localModules'); // Replace './yourModule' with the correct path to your module file
const mqtt = require('mqtt');

// MQTT broker connection options
const brokerUrl = 'http://10.239.139.240'; // Replace with your broker URL
const options = { clientId: 'mqtt-receiver'};

const device1Topic = 'init';
const device2Topic = 'data';

// Data Packet Structure

// Topic: Message

// Setup Communication:
// Client -> Broker
// init: Setup <ip> <macAddress>

// Broker -> Client
// init: Setup <deviceID>

// Data Communication:
// Client -> Broker
// data: Data <deviceID> <deviceName> <temp> <humidity> <time>

// Configure Communication:
// Broker -> Client
// configure: Config <deviceID> <temp/humid> <frequency <units>


// Connect to the MQTT broker
const client = mqtt.connect(brokerUrl, options);

client.on('connect', () => {
  console.log("//////////////////////////////////////")
  console.log('LabSensor.us Data Subscriber Connected to MQTT broker');

  subscribeToTopic(device1Topic, () => {
    subscribeToTopic(device2Topic, () => {
      // This block will be executed after both subscriptions are complete
      console.log("//////////////////////////////////////");
    });
  });
});


// Handle incoming messages
client.on('message', (topic, message) => {
  console.log(`Received message on topic: ${topic} / ${message.toString()}`);
  switch (topic) {

    // init topic
    case device1Topic:
        const message = testGetDevice();
        console.log(message);
        break;

    // data topic
    case device2Topic:
        console.log("now we have data")
        testAddData();
        break;

    default:
        console.log("I am not sure what this message is...")
        break;
  }
});

// Handle error event
client.on('error', (error) => {
  console.error(`Error: ${error}`);
});

// Handle close event
client.on('close', () => {
  console.log('Connection closed');
});

function subscribeToTopic(topic, callback) {
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Subscribed to: ${topic}`);
      callback(); // Invoke the callback once the subscription is complete
    } else {
      console.error(`Error subscribing to ${topic}: ${err}`);
      callback(); // Invoke the callback even if there is an error
    }
  });
}
