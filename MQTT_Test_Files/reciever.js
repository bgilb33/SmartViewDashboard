const mqtt = require('mqtt');

// MQTT broker connection options
const brokerUrl = 'http://10.239.139.240'; // Replace with your broker URL
const options = {
  clientId: 'mqtt-receiver',
};

const device1Topic = 'init';
const device2Topic = 'data';

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
  switch (topic) {
    case device1Topic:
        console.log("we have a new device... maybe?")
        break;
    case device2Topic:
        console.log("now we have data")
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

function getDeviceById(deviceId) {
  const existingDevice = devicesData.find((device) => device.DeviceID === deviceId);

  if (existingDevice) {
    return existingDevice;
  } else {
    // Generate a unique device with default parameters
    const uniqueDevice = {
      "DeviceID": devicesData.length + 1,
      "DeviceName": "Default Device",
      "IPAddress": "192.168.1.104",
      "Frequency": 60,
      "Units": "minute",
      "MacAddress": "FF:FF:FF:FF:FF:FF",
      "Visibility": true,
    };

    // Add the unique device to the devicesData array
    devicesData.push(uniqueDevice);

    return uniqueDevice;
  }
}