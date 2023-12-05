const express = require('express');
const app = express();
const port = 3004;

const { findLab } = require('./QueryModules'); // Replace './yourModule' with the correct path to your module file

// Middleware for logging and parsing JSON in the request body
app.use(express.json());

app.get('/', (req, res) => {
  res.send('LabSensors API is Active');
});

// General Finder
app.get('/getAPI', async (req, res) => {
    const nameOfLab = req.query.labName;
    const passwordOfLab = req.query.labPassword;

    try {
      const labData = await findLab(nameOfLab,passwordOfLab);
      if (labData) {
        res.send(`Lab Data:${labData}`);
      } else {
        console.log('Failed to read Lab Data.');
        res.send("hello2");

        // res.send("Failed to get data");
      }
    } catch (error) {
      res.send("caught an error");
    }
});

// Homepage endpoints
app.get('/nialab', (req, res) => {
    res.send("welcome to the Nia Lab");
});

app.get('/nialab/GetDevices', (req, res) => {
  const deviceIDs = devicesData.map(device => device.DeviceID);
  res.json(deviceIDs); // Return the array of DeviceIDs as JSON
});

app.get('/nialab/GetInfo', (req, res) => {
    const sensorID = parseInt(req.query.sensorID);
    
    const device = devicesData.find(device => device.DeviceID === sensorID);

    if (device) {
      res.json(device); // Return the device object as JSON
    } else {
      res.status(404).send("Device not found");
    }
});

app.post('/nialab/SetName', (req, res) => {
    const deviceID = parseInt(req.query.deviceID);
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


app.post('/nialab/SetVisibility', (req, res) => {
    const deviceID = parseInt(req.query.DeviceID);
    const newVisibility = req.query.DeviceVisibility;
  
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


// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});





