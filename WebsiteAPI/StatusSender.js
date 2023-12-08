const mqtt = require('mqtt');

// MQTT broker URL
const mqttBrokerUrl = 'mqtt://192.168.1.7'; // Replace with your MQTT broker URL

// MQTT topics
const sendTopic = 'STATUS/OUT'; // Replace with the topic to send the message
const receiveTopic = 'STATUS/IN'; // Replace with the topic to listen for responses

const parsedDataArray = [];

function parseMessage(message) {
  // Split the message into an array using space as the delimiter
  const parts = message.split(' ');

  // Check if the message has at least two parts
  if (parts.length >= 2) {
    // Extract the first and second letters (ID and status)
    const id = parts[0].charAt(0);
    const status = parts[1].charAt(0);

    // Store the parsed data in the array
    parsedDataArray.push({ id, status });
  } else {
    console.error('Invalid message format:', message);
  }
}

function getStatusOfDevices() {
  // Create an MQTT client
  const client = mqtt.connect(mqttBrokerUrl);

  // Subscribe to the receive topic
  client.subscribe(receiveTopic);

  // Callback function when a message is received
  client.on('message', (topic, receivedMessage) => {
    // Parse the received message
    parseMessage(receivedMessage.toString());
  });

  // Publish the message to the send topic
  client.publish(sendTopic, "STATUS");

  // Set a timeout to end the MQTT connection after 10 seconds
  setTimeout(() => {
    // Unsubscribe from the receive topic
    client.unsubscribe(receiveTopic);
    client.end();

    // Print the object after 10 seconds
    return parsedDataArray;
  }, 10000); // 10000 milliseconds = 10 seconds
}


module.exports = getStatusOfDevices;

