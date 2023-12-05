const express = require('express');
const app = express();
const port = 3004;

const fs = require('fs');
const path = require('path');
const devicesFilePath = path.resolve(__dirname, '../dataFile.json'); // Adjust the path based on your project structure
let LabData = require(devicesFilePath);
let devicesData = LabData.devicesData;
let sensorData = LabData.dataArray;

// API Startpoint
// Local: http://localhost:3004
// Global


const { getXDataPoints, getMostRecentData, findLab } = require('./appModules'); // Replace './yourModule' with the correct path to your module file

// Middleware for logging and parsing JSON in the request body
app.use(express.json());

app.get('/', (req, res) => {
  res.send('LabSensors API is Active');
});

// General Finder
app.get('/getAPI', async (req, res) => {
    const nameOfLab = req.query.labName;
    const passwordOfLab = req.query.labPassword;

    // Query labData given a username and password TO DO
    // Return not found lab, inforrect password or api endpoint
});



///////////////////////
// Homepage endpoints
///////////////////////
app.get('/nialab', (req, res) => {
    res.send("welcome to the Nia Lab");
});

// Return all ID's in device list
app.get('/nialab/GetDevices', (req, res) => { // I think this works 
  const deviceIDs = devicesData.map(device => device.DeviceID);
  res.json(deviceIDs); // Return the array of DeviceIDs as JSON
});

// given a sensor ID, return all the information 
app.get('/nialab/GetInfo', (req, res) => {
    const sensorID = req.query.sensorID;
    
    const device = devicesData.find(device => device.DeviceID === sensorID);

    if (device) {
      res.json(device); // Return the device object as JSON
    } else {
      res.status(404).send("Device not found");
    }
});

// Given a device ID, set the name of that sensor name 
app.post('/nialab/SetName', (req, res) => {
    const deviceID = req.query.deviceID;
    const newDeviceName = req.query.deviceName;
  
    // Find the device in devicesData based on DeviceID
    const deviceToUpdate = devicesData.find(device => device.DeviceID === deviceID);
  
    if (deviceToUpdate) {
      // Update the device name
      deviceToUpdate.DeviceName = newDeviceName;
      res.json(deviceToUpdate); // Return the updated device as JSON
    } else {
      res.status(404).send("Device not found");
    }
  });

// Given a device ID, change the visibility on the homepage
app.post('/nialab/SetVisibility', (req, res) => {
    const deviceID = req.query.deviceID;
    const newVisibility = req.query.deviceVisibility;
  
    // Find the device in devicesData based on DeviceID
    const deviceToUpdate = devicesData.find(device => device.DeviceID === deviceID);
  
    if (deviceToUpdate) {
      // Update the device visibility
      deviceToUpdate.Visibility = newVisibility;
      res.send(deviceToUpdate); // Return NULL as specified
    } else {
      res.status(404).send("Device not found");
    }
  });


app.get('/nialab/GetHomePageData', (req, res) => {
  res.send(getMostRecentData());
});

///////////////////////
// Sensor Page endpoints
///////////////////////

// for an input X and the device ID return the last x tempature and humidity sensor.
app.get('/nialab/getPoints', (req, res) => {
  const deviceID = req.query.deviceID;
  const NumPoints = parseInt(req.query.numPoints);

  const dataPoints = getXDataPoints(deviceID, NumPoints);

  res.send(dataPoints);
});
// GetInfo endpoint from above


// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});





