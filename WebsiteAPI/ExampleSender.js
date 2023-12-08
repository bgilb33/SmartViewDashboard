const sendConfigData = require('./ConfigSender');
const getStatusOfDevices = require('./StatusSender');

// Change these variables to change which function you are testing
const send1 = true; // Change this condition as needed
const send2 = false; // Change this condition as needed




//////////////////////////////////////////////////////////////////////////////
// This is an example sending configuration data from the website to the PI //
//////////////////////////////////////////////////////////////////////////////
//Backround: Have the ESP32 Running, and the broker, you can then see via the serial port that the device has configured new settings 
//INPUTS: Data you want to change
//OUTPUTS: NULL

if(send1){
const exampleData = {
  "DeviceID": 1,
  "Frequency": 3,
  "Units": "Hour"
};

// Call the function with the example data
sendConfigData(exampleData);
}



////////////////////////////////////////////////////////////////////////////////
// This is an example of quering the status of all the devices in the network //
////////////////////////////////////////////////////////////////////////////////
//Backround: Run this file here, also run the "sender.js" with topic = "STATUS", add dummy points like "1 0" to show data from devices coming back.
//INPUTS: NULL
//OUTPUTS: Something like this:
    // Parsed data after 10 seconds: [
    //   { id: '0', status: '0' },
    //   { id: '1', status: '0' },
    //   { id: '1', status: '1' },
    //   { id: '3', status: '1' },
    //   { id: '2', status: '1' }
    // ]
//OUTPUT Definition: if the status is 1, it means it is sending data, if it is 0 it means it has not been added to the network yet
if(send2){
console.log(getStatusOfDevices());
}