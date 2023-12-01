const express = require('express');
const app = express();
const port = 3004;

// Middleware for logging and parsing JSON in the request body
app.use(express.json());

// General Finder
app.get('/getAPI', (req, res) => {
    const nameOfLab = req.query.labName;
    const passwordOfLab = req.query.labPassword;

    const returnString = findLab(nameOfLab,passwordOfLab);
    res.send(`${returnString}`);
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


// Functions
function findLab(username, password) {

    username = username.toLowerCase();
    password = password.toLowerCase();

    const labKeys = Object.keys(labData);

    for (const labKey of labKeys) {
        const lab = labData[labKey];

        if (lab.name === username) {
            if (lab.password === password) {
                return lab.api;
            }else{
                return 'Incorrect password';
            }  
        } else {
            return 'Lab Not Found';
        }
    }
}



// Example Data
const devicesData = [
    {
      "DeviceID": 1,
      "DeviceName": "Lab Room 1",
      "IPAddress": "192.168.1.101",
      "Frequency": 60,
      "Units": "hour",
      "MacAddress": "00:1A:2B:3C:4D:5E",
      "Visibility": true
    },
    {
      "DeviceID": 2,
      "DeviceName": "Lab Room 2",
      "IPAddress": "192.168.1.102",
      "Frequency": 30,
      "Units": "minute",
      "MacAddress": "01:2A:3B:4C:5D:6E",
      "Visibility": true
    },
    {
      "DeviceID": 3,
      "DeviceName": "Confrence Room",
      "IPAddress": "192.168.1.103",
      "Frequency": 120,
      "Units": "second",
      "MacAddress": "02:3A:4B:5C:6D:7E",
      "Visibility": false
    }
    // Add more devices as needed
  ];
    

const labData = {
    lab1: {
        password: 'pi4life',
        name: 'nia lab',
        api: 'nialab'
    },
    lab2: {
        password: 'password2',
        name: 'little lab',
        api: 'littlelab'
    },
    lab3: {
        password: 'password3',
        name: 'green lab',
        api: 'greenlab'
    },
    lab4: {
        password: 'password4',
        name: 'song Lab',
        api: 'songlab'
    }
};



