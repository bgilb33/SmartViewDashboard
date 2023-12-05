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

function addDataToDeviceArray(deviceID, time, temperature, humidity) {
    const newDataEntry = {
      "DeviceID": deviceID,
      "Time": time,
      "Temperature": temperature,
      "Humidity": humidity,
    };
  
    sensorData.push(newDataEntry);

    writeDataToFile();
}

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

function getXDataPoints(deviceID, x) {
    // Filter data by the provided device ID
    const filteredData = sensorData.filter(entry => entry.DeviceID === deviceID);
  
    // Sort the filtered data by Time in descending order
    const sortedData = filteredData.sort((a, b) => b.Time - a.Time);
    const result = sortedData.slice(0, x);
  
    return result;
  }

// Example usage1:
// const deviceIdToSearch = -1;
// const MacAddressToSearch = "FF:FF:FF:FF:FF:FF";
// const IPAddressToSearch = "120.0.0.1";

// const foundDevice = getDeviceById(deviceIdToSearch, MacAddressToSearch, IPAddressToSearch);
// console.log(foundDevice);

// Example usage2:
// const newDeviceID = "someID2";
// const newTime = 1701783788;
// const newTemperature = 27;
// const newHumidity = 55;

// addDataToDeviceArray(newDeviceID, newTime, newTemperature, newHumidity);

// Example 3
const deviceIDToSearch = "someID2";
const numberOfResults = 3;

const dataPoints = getXDataPoints(deviceIDToSearch, numberOfResults);

console.log("Most recent lowest data points:", dataPoints);
