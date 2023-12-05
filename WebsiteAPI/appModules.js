const fs = require('fs');
const path = require('path');
const devicesFilePath = path.resolve(__dirname, '../dataFile.json'); // Adjust the path based on your project structure
let LabData = require(devicesFilePath);
let devicesData = LabData.devicesData;
let sensorData = LabData.dataArray;


async function writeData(data) {
  const lockfilePath = `${filePath}.lock`;

  try {
    await lockFile.lock(lockfilePath);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } finally {
    await lockFile.unlock(lockfilePath);
  }
}

async function findLab(username, password) {
  username = username.toLowerCase();
  password = password.toLowerCase();

  try {
    const data = fs.readFileSync('dataFile.json', 'utf8');
    const jsonData = JSON.parse(data);

    const labKeys = Object.keys(jsonData.labData);

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
  } catch (error) {
    console.error('Error reading labData:', error.message);
    return null;
  }
  // return "yourTest"
}

function getXDataPoints(deviceID, x) {
  // Filter data by the provided device ID
  const filteredData = sensorData.filter(entry => entry.DeviceID === deviceID);

  // Sort the filtered data by Time in descending order
  const sortedData = filteredData.sort((a, b) => b.Time - a.Time);
  const result = sortedData.slice(0, x);

  return result;
}

module.exports = { writeData, findLab, getXDataPoints};