const sendConfigData = require('./ConfigSender');
const getStatusOfDevices = require('./StatusSender');

// Change these variables to change which function you are testing
const send1 = true; // Change this condition as needed
const send2 = true; // Change this condition as needed



//////////////////////////////////////////////////////////////////////////////
// This is an example sending configuration data from the website to the PI //
//////////////////////////////////////////////////////////////////////////////
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