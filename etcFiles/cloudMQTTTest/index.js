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
  username: 'nialab',
  password: 'pi4life',
  reconnectPeriod: 1000,
  // If the server is using a self-signed certificate, you need to pass the CA.
  ca: fs.readFileSync('./broker.emqx.io-ca.crt'),
})

const topic = '/nodejs/mqtt'

client.on('connect', () => {
  console.log('Connected')

  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
    client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })  
  })

  client.publish(topic, message, (err) => {
    if (err) {
      console.error('Error publishing message:', err);
    } else {
      console.log('Message published successfully');
      // Disconnect after publishing
    }
  });
})

const message = 'Hello, EMQX Cloud!';

client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
})