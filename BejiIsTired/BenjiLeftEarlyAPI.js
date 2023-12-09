const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3004;

app.use(bodyParser.json());

app.post('/AddDevice', (req, res) => {
  // Assuming labApi=nialab is part of the query parameters
  const labApi = req.query.labApi;

  // Assuming the request body contains MAC and IP properties
  const { MAC, IP } = req.body;

  // Perform any necessary logic with MAC and IP, and construct the response
  const DeviceID = 1; // Replace with actual DeviceID logic
  const Frequency = 10; // Replace with actual Frequency logic
  const Units = 'Minute'; // Replace with actual Units logic

  const resultVars = { DeviceID, Frequency, Units };

  // Send the response as JSON
  res.json(resultVars);
});

let deviceData = [];

app.put('/UpdateDeviceData', (req, res) => {
  // Assuming labApi=nialab is part of the query parameters
  const labApi = req.query.labApi;

  // Assuming the request body contains DeviceID, Temperature, Humidity, and Time properties
  const { DeviceID, Temperature, Humidity, Time } = req.body;

  // Save the data to the in-memory array (simulating database update)
  deviceData.push({ DeviceID, Temperature, Humidity, Time });

  res.send('Data updated successfully');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
