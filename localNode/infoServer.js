const mqtt = require('mqtt');
// Message Context
// topic: INIT/IN SETUP 0C:DC:7E:CB:6C:D0 1 10 Minute

// MQTT broker connection options
const brokerUrl = 'mqtt://192.168.1.7'; // Replace with your broker URL
const options = {
  clientId: 'mqtt-sender',
};

const subscribeTopic = "INIT/OUT";


// Connect to the MQTT broker
const client = mqtt.connect(brokerUrl, options);


// Declare deviceMac in a higher scope

client.on('message', async (topic, message) => {
  console.log(`Received message on topic: ${topic} / ${message.toString()}`);
  if (topic == subscribeTopic) {

  // var stringToSend = "SETUP 0C:DC:7E:CB:6C:D0 68 10 Minute";
  let returnString = await GetIDAndReturnString(message.toString());

  sendMQTTMessage(await returnString);
  }
});

// Handle connection event
client.on('connect', () => {
    console.log("//////////////////////////////////////")
    console.log('LabSensor.us Info Subscriber Connected to MQTT broker');
    subscribeToTopic(subscribeTopic, () => {console.log("//////////////////////////////////////");});
});

// Handle error event
client.on('error', (error) => {
    console.error(`Error: ${error}`);
});

// The function will parse the input string from the MQTT
function GetIDAndReturnString(inputString) {
  // Split the input string into an array of words
  const words = inputString.split(' ');
  console.log(words);

  returnString = ReturnIDAndString(words[1], words[2]);

  // Extract numerical values from the words and convert them to floating-point numbers  

  return returnString;
}  

async function ReturnIDAndString(deviceIP, deviceMac) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
      "MAC": deviceMac,
      "IP": deviceIP
  });

  var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  };

  // const response = await fetch("http://192.168.1.23:3004/AddDevice?labApi=nialab", requestOptions);
  const response = await fetch("http://192.168.1.23:3004/AddDevice?labApi=nialab", requestOptions);
  const data = await response.json();
  const { DeviceID, Frequency, Units } = await data;
  var returnString = await createString(deviceMac, DeviceID, Frequency, Units);
  return returnString;
}

async function createString(deviceMac,deviceID,frequency,units){
    // SETUP + mac + device ID + frequency + units;
    var returnString = "SETUP " + deviceMac + " " + deviceID +  " " + frequency + " " + units;

    return returnString;
}


function sendMQTTMessage(message){
    const publishTopic = 'INIT/IN';
    client.publish(publishTopic, message, (err) => {
      if (!err) {
        console.log(`Published message to ${publishTopic}: ${message}`);
      } else {
        console.error(`Error publishing message: ${err}`);
      }
    });
}

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
  