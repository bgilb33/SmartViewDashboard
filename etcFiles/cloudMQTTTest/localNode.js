const mqtt = require('mqtt')

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

const labName = ['nialab', 'anotherlab'];
const topicPart = ['/INIT/OUT', '/DATA', '/STATUS/IN'];

const topics = [];

// Nested loops to combine each lab with each topic part
for (let i = 0; i < labName.length; i++) {
  for (let j = 0; j < topicPart.length; j++) {
    const topic = labName[i] + topicPart[j];
    topics.push(topic);
  }
}

client.on('connect', () => {
  console.clear();
  console.log('////////////////////////////');
  console.log('LabSensor LocalNode Connected')
  console.log('Connected to the Following topics:');
  console.log('////////////////////////////');

  subscribeToTopics(topics)
  .then(() => {
    console.log('////////////////////////////');
  })
  .catch((error) => {
    console.error('Error subscribing to topics:', error);
  });

})

// On messages run this function
client.on('message', async (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
  
  // Parse the topic for the lab and topic type
  const returnInfo = await parseTopic(topic.toString());

  if (!labName.includes(returnInfo[0])) {
    console.log(`ERROR: ${returnInfo[0]} is not in the list of labs`);
  } else {
    // console.log(`SUCESS: ${returnInfo[0]} is in the list of labs`);
  }

  // init out
  // here we are trying to inilize the devices
  if(returnInfo[1] == topicPart[0]){
    console.log("INIT message detected");
    console.log("Here is where I will call an API to add a device");

  }

  // Incoming Data Message
  if(returnInfo[1] == topicPart[1]){
    console.log("DATA message detected");

    const returnTopic = returnInfo[0] + "/INIT/IN";
    const message = "hello mom";

    try {
      publishMessage(returnTopic, message);
    } catch (error) {
      console.log("ERROR: Unable to send MQTT Message");
    }
  }

  //status in
  if(returnInfo[1] == topicPart[2]){
    console.log("STATUS message detected");
    console.log("Here is where I will call and API to return the status");


  }
  console.log();
})

//////////////////////////////
//        Functions         //
//////////////////////////////

function publishMessage(returnTopic, outMessage){
  client.publish(returnTopic, outMessage, (err) => {
    if (!err) {
      console.log(`Published message to ${returnTopic}: ${outMessage}`);
    } else {
      console.error(`Error publishing message: ${err}`);
    }
  });

}

async function parseTopic(inputString){
  var resultArray = inputString.split('/');

  var lab = resultArray[0];
  var restOfTopic = "/" + resultArray.slice(1).join('/');

  let returnArray = [lab, restOfTopic]

  return returnArray;
}

// Function to subscribe to topics
function subscribeToTopics(topics) {
  const promises = [];

  for (let i = 0; i < topics.length; i++) {
    const promise = new Promise((resolve) => {
      client.subscribe([topics[i]], () => {
        console.log(`Subscribe to topic '${topics[i]}'`);
        resolve();
      });
    });

    promises.push(promise);
  }

  return Promise.all(promises);
}