const mqtt = require('mqtt');

// MQTT broker connection options
const brokerUrl = 'http://192.168.1.7'; // Replace with your broker URL
const options = {
  clientId: 'mqtt-receiver',
};

const deviceTopic = 'DATA';

// Connect to the MQTT broker
const client = mqtt.connect(brokerUrl, options);

client.on('connect', () => {
  console.log("//////////////////////////////////////")
  console.log('LabSensor.us Data Subscriber Connected to MQTT broker');

  subscribeToTopic(deviceTopic, () => {
      console.log("//////////////////////////////////////");
  });
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

// Handle incoming messages
client.on('message', (topic, message) => {
  console.log(`Received message on topic: ${topic} / ${message.toString()}`);
  if(topic == deviceTopic)
  
    // console.log("Packet Recieved Insert Into Database");
    var result = parseString(message.toString());


    // Call benji function with arguments: DeviceID, tempature, hummidity;
    insertIntoDatabase(result[0], result[1], result[2]); 
});

// Handle error event
client.on('error', (error) => {
  console.error(`Error: ${error}`);
});

// Handle close event
client.on('close', () => {
  console.log('Connection closed');
});

function insertIntoDatabase(deviceID, tempature, hummidity){
  console.log("------");
  console.log("Data:");
  console.log(deviceID);
  console.log(tempature);
  console.log(hummidity);
  console.log("------");
}

function parseString(inputString) {
  // Split the input string into an array of words
  const words = inputString.split(' ');
  // Extract numerical values from the words and convert them to floating-point numbers
  const values = words.map(word => parseFloat(word));

  // Filter out NaN values (non-numeric words)
  const numericValues = values.filter(value => !isNaN(value));

  return numericValues;
}
