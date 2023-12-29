const mqtt = require('mqtt')
const fs = require('fs')
const protocol = 'mqtts'
// Set the host and port based on the connection information.
const host = 'u88196e4.ala.us-east-1.emqxsl.com'
const port = '8883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `${protocol}://${host}:${port}`

// const APIURL = 'http://localhost:8888/.netlify/functions/';
// or
//const APIURL = 'http://netlify app or something?/.netlify/functions/';


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
const topicPart = ['INIT/OUT', 'DATA', 'STATUS/IN'];

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
    console.log();
  })
  .catch((error) => {
    console.error('Error subscribing to topics:', error);
  });
})

client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
})


// client.on('message', (topic, message) => {
//     console.log("hi mom");
    // console.log(`Received message on topic: ${topic} / ${message.toString()}`);
    // const lab = await parseTopic(topic.toString());
    // console.log(lab);

    // if (!labName.includes(lab[0])) {
    //   console.log(`ERROR: ${lab[0]} is not in the list of labs`);
    // } else {
    //   console.log(`SUCESS: ${lab[0]} is in the list of labs`);
    // }

    // console.log(`The second part of the topic is ${lab[1]}`);

    // // init out
    // if(lab[1] == topicPart[0]){
    //   console.log("Init message detected");

    // }

    // // data
    // if(lab[1] == topicPart[1]){
    //   console.log("data message detected");

    // }

    // //status in
    // if(lab[1] == topicPart[2]){
    //   console.log("status message detected");

    // }

  // });




//////////////////////////////
//        Functions         //
//////////////////////////////

// function parseSetupString(inputString) {
//     // Split the input string into an array of words

//     const words = inputString.split(' ');
//     console.log(words);
  
//     returnString = ReturnIDAndString(words[1], words[2]);
  
//     // Extract numerical values from the words and convert them to floating-point numbers  
  
//     return returnString;
// }  

// async function parseTopic(inputString){
//   console.log(inputString);
//   // const words = inputString.split('/', 2);
//   // console.log(`The message is for topic: ${words[0]}`);
//   // return words;
// }

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