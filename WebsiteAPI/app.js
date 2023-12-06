const express = require('express');
const app = express();
const port = 3004;

const fs = require('fs');
const path = require('path');
const devicesFilePath = path.resolve(__dirname, '../dataFile.json'); // Adjust the path based on your project structure
let LabData = require(devicesFilePath);
// let devicesData = LabData.devicesData;
// let sensorData = LabData.dataArray;

// API Startpoint
// Local: http://localhost:3004
// 


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

// Gets All Home Page Data
app.get('/nialab/GetHomePageData', (req, res) => {
  res.send(getMostRecentData());
});

///////////////////////
// Sensor Page endpoints
///////////////////////

app.get('/nialab/GetAllConfig', (req, res) => {

})


// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});





