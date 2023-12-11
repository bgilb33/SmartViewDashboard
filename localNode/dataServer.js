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
    parseStringAndAddData(message.toString());


});

// Handle error event
client.on('error', (error) => {
  console.error(`Error: ${error}`);
});

// Handle close event
client.on('close', () => {
  console.log('Connection closed');
});



function parseStringAndAddData(inputString) {
  // Split the input string into an array of words
  const words = inputString.split(' ');
  // Extract numerical values from the words and convert them to floating-point numbers
  const values = words.map(word => parseFloat(word));

  // Filter out NaN values (non-numeric words)
  const numericValues = values.filter(value => !isNaN(value));

  addData(numericValues[0], numericValues[1], numericValues[2], numericValues[3])

}

async function addData(DeviceID, Time, Temperature, Humidity) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "DeviceID": DeviceID,
    "Temperature": Temperature,
    "Humidity": Humidity,
    "Time": Time
  });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://192.168.1.23:3004/UpdateDeviceData?labApi=nialab", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

}