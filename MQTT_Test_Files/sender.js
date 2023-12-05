const mqtt = require('mqtt');
const readline = require('readline');

// MQTT broker connection options
const brokerUrl = 'mqtt://10.239.139.240'; // Replace with your broker URL
const options = {
  clientId: 'mqtt-sender',
};

// Connect to the MQTT broker
const client = mqtt.connect(brokerUrl, options);

// Interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt the user for input
function promptUser() {
  // Ask the user for input
  rl.question('Enter message to send (type "quit" to exit): ', (message) => {
    // Check if the user wants to quit
    if (message.toLowerCase() === 'quit') {
      // Close the connection and the readline interface
      client.end();
      rl.close();
    } else {
      // Publish the user's message to a topic
      const publishTopic = 'data';
      client.publish(publishTopic, message, (err) => {
        if (!err) {
          console.log(`Published message to ${publishTopic}: ${message}`);
        } else {
          console.error(`Error publishing message: ${err}`);
        }

        // Recursively prompt the user for the next input
        promptUser();
      });
    }
  });
}

// Handle connection event
client.on('connect', () => {
    console.log('Sender connected to MQTT broker');
    promptUser();
});

// Handle error event
client.on('error', (error) => {
    console.error(`Error: ${error}`);
});
