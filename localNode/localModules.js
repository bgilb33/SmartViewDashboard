const fs = require('fs');
const path = require('path');
const devicesFilePath = path.resolve(__dirname, '../dataFile.json'); // Adjust the path based on your project structure
let LabData = require(devicesFilePath);
let devicesData = LabData.devicesData;
let sensorData = LabData.dataArray;

function getDeviceById(deviceId, IPAddress, MacAddress) {
  const existingDevice = devicesData.find((device) => device.DeviceID === deviceId);

  if (existingDevice) {
    return "Device exsists start sending Data";
  } else {

    const maxDeviceID = Math.max(...devicesData.map(device => device.DeviceID), 0);
    const newDeviceID = maxDeviceID + 1;

    // Generate a unique device with default parameters
    const uniqueDevice = {
      "DeviceID": newDeviceID,
      "DeviceName": "Default Device",
      "IPAddress": IPAddress,
      "Frequency": 60,
      "Units": "minute",
      "MacAddress": MacAddress,
      "Visibility": true,
    };

    // Add the unique device to the devicesData array
    devicesData.push(uniqueDevice);

    // Write the updated data back to the file
    writeDataToFile();

    return uniqueDevice;
  }
}

function addDataPointToArray(deviceID, time, temperature, humidity) {
    const newDataEntry = {
      "DeviceID": deviceID,
      "Time": time,
      "Temperature": temperature,
      "Humidity": humidity,
    };
  
    sensorData.push(newDataEntry);

    writeDataToFile();
}


// maybe update this in the furture...
function writeDataToFile() {
    const updatedData = {
      ...LabData,
      dataArray: dataArray,
    };
  
    fs.writeFileSync(devicesFilePath, JSON.stringify(updatedData, null, 2));
  }

function writeDataToFile() {
  const updatedData = {
    ...LabData,
    devicesData: devicesData,
  };

  fs.writeFileSync(devicesFilePath, JSON.stringify(updatedData, null, 2));
}


function testGetDevice(){
  const deviceIdToSearch = 3;
  const MacAddressToSearch = "FF:FF:FF:FF:FF:FF";
  const IPAddressToSearch = "120.0.0.1";

  const response = getDeviceById(deviceIdToSearch, MacAddressToSearch, IPAddressToSearch);
  // console.log(response);
  return response;
}

function testAddData(){
  const newDeviceID = "someID2";
  const newTime = 1701783788;
  const newTemperature = 27;
  const newHumidity = 55;

  addDataPointToArray(newDeviceID, newTime, newTemperature, newHumidity);
}

module.exports = { testAddData, testGetDevice, getDeviceById, addDataPointToArray};

// Testing Code

// Example usage2:
// const newDeviceID = "someID2";
// const newTime = 1701783788;
// const newTemperature = 27;
// const newHumidity = 55;

// addDataToDeviceArray(newDeviceID, newTime, newTemperature, newHumidity);
