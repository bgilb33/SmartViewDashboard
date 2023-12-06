const tingodb = require('tingodb')();

const connectToDatabase = (callback) => {
  const db = new tingodb.Db('./labsensordb', {});
  db.open((err) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      callback(null, db);
    }
  });
};

const getCollection = (db, collectionName) => {
  return db.collection(collectionName);
};

const initializeLabs = (db, callback) => {
  const labCollection = getCollection(db, 'labCollection');

  labCollection.count({}, (err, count) => {
    if (err) {
      console.error(err);
      callback(err);
    }

    if (count === 0) {
      const labs = [
        {
          "labID": 1,
          "password": "pi4life",
          "name": "nia lab",
          "api": "nialab"
        },
        {
          "labID": 2,
          "password": "password2",
          "name": "little lab",
          "api": "littlelab"
        }
      ];

      labCollection.insert(labs, (insertErr, result) => {
        if (insertErr) {
          console.error(insertErr);
          callback(insertErr);
        }
        callback(null, result);
      });
    } else {
      callback(null, 'Collection is not empty');
    }
  });
};

const login = (db, username, password, callback) => {
  const labCollection = getCollection(db, 'labCollection');

  labCollection.findOne({ name: username, password: password }, (err, user) => {
    if (err) {
      console.error(err);
      callback(err);
    }

    if (user) {
      // User found, login successful
      callback(null, true);
    } else {
      // User not found, login failed
      callback(null, false);
    }
  });
};

const insertTestData = (db, callback) => {
  // Insert test data for each lab
  const insertDataForLab = (labApi, collectionName, data, configData, alarmData) => {
    const dataCollection = getCollection(db, `${labApi}_dataCollection`);
    const configCollection = getCollection(db, `${labApi}_configCollection`);
    const alarmCollection = getCollection(db, `${labApi}_alarmCollection`);

    dataCollection.count({}, (err, count) => {
      if (err) {
        console.error(err);
        callback(err);
      }

      if (count === 0) {
        dataCollection.insert(data, (dataInsertErr, dataInsertResult) => {
          if (dataInsertErr) {
            console.error(dataInsertErr);
            callback(dataInsertErr);
          }

          // Insert corresponding config data for each device
          configCollection.insert(configData, (configInsertErr, configInsertResult) => {
            if (configInsertErr) {
              console.error(configInsertErr);
              callback(configInsertErr);
            }

            // Insert alarm data for each device
            alarmCollection.insert(alarmData, (alarmInsertErr, alarmInsertResult) => {
              if (alarmInsertErr) {
                console.error(alarmInsertErr);
                callback(alarmInsertErr);
              }

              callback(null, 'Test data insertion completed');
            });
          });
        });
      } else {
        callback(null, `Collection ${collectionName} for ${labApi} is not empty`);
      }
    });
  };

  // Define test data for each lab
  const testDataForLabs = {
    nialab: [
      {
        "DeviceID": 1,
        "DeviceName": "Lab Room 1",
        "Time": 1701783780,
        "Temperature": 27,
        "Humidity": 55
      },
      {
        "DeviceID": 2,
        "DeviceName": "Snack Room 1",
        "Time": 1701783780,
        "Temperature": 17,
        "Humidity": 44
      },
      // Add more data for nialab if needed
    ],
    littlelab: [
      {
        "DeviceID": 1,
        "DeviceName": "Lab Room 2",
        "Time": 1701783780,
        "Temperature": 27,
        "Humidity": 55
      },
      // Add more data for littlelab if needed
    ],
  };

  // Define test config data for each lab
  const testConfigDataForLabs = {
    nialab: [
      {
        "DeviceID": 1,
        "DeviceName": `Lab Room 1`,
        "Frequency": 7,
        "Units": 'Hour'
      },
      {
        "DeviceID": 2,
        "DeviceName": `Snack Room 1`,
        "Frequency": 12,
        "Units": 'Minute'
      },
      // Add more config data if needed
    ],
    littlelab: [
      {
        "DeviceID": 1,
        "DeviceName": `Lab Room 2`,
        "Frequency": 10,
        "Units": 'Minute'
      },
      // Add more config data if needed
    ],
  };

  // Define test alarm data for each lab
  const testAlarmDataForLabs = {
    nialab: [
      {
        "DeviceID": 1,
        "AlarmID": 1,
        "DeviceName": "Lab Room 1",
        "SensorType": "Temperature",
        "Threshold": 30,
        "Compare": ">"
      },
      // Add more alarm data if needed
    ],
    littlelab: [
      {
        "DeviceID": 1,
        "AlarmID": 1,
        "DeviceName": "Lab Room 2",
        "SensorType": "Humidity",
        "Threshold": 40,
        "Compare": "<"
      },
      // Add more alarm data if needed
    ],
  };

  // Insert test data for each lab
  Object.entries(testDataForLabs).forEach(([labApi, data]) => {
    const configData = testConfigDataForLabs[labApi];
    const alarmData = testAlarmDataForLabs[labApi];
    insertDataForLab(labApi, 'dataCollection', data, configData, alarmData);
  });

  // Return a callback to indicate completion
  callback(null, 'Test data insertion completed');
};

const getAllConfig = (db, labApi, callback) => {
  const configCollection = getCollection(db, `${labApi}_configCollection`);

  configCollection.find({}).toArray((err, config) => {
    if (err) {
      console.error(err);
      callback(err);
    }

    if (config.length === 0) {
      callback(null, `Config not found or collection is empty for ${labApi}`);
    } else {
      callback(null, config);
    }
  });
};

const getAllHomePageData = (db, labApi, callback) => {
  const configCollection = getCollection(db, `${labApi}_dataCollection`);

  configCollection.find({}).toArray((err, config) => {
    if (err) {
      console.error(err);
      callback(err);
    }

    if (config.length === 0) {
      callback(null, `Config not found or collection is empty for ${labApi}`);
    } else {
      callback(null, config);
    }
  });
};

const getAllAlarms = (db, labApi, callback) => {
  const alarmCollection = getCollection(db, `${labApi}_alarmCollection`);

  alarmCollection.find({}).toArray((err, alarmData) => {
    if (err) {
      console.error(err);
      callback(err);
    }

    callback(null, alarmData);
  });
};

const editDeviceConfig = (db, labApi, deviceConfig, callback) => {
  const configCollection = getCollection(db, `${labApi}_configCollection`);

  const { DeviceID } = deviceConfig;
  
  configCollection.update({ DeviceID }, { $set: deviceConfig }, (err, result) => {
    if (err) {
      console.error(err);
      callback(err);
    }

    callback(null, result);
  });
};

const removeDevice = (db, labApi, deviceID, callback) => {
  const dataCollection = getCollection(db, `${labApi}_dataCollection`);
  const configCollection = getCollection(db, `${labApi}_configCollection`);

  // Log the existing devices in dataCollection
  dataCollection.find({}).toArray((findErr, devices) => {
    if (findErr) {
      console.error('Error finding devices in dataCollection:', findErr);
      callback(findErr);
      return;
    }


    // Find the device based on DeviceID
    dataCollection.findOne({ DeviceID: parseInt(deviceID) }, (findDeviceErr, device) => {      if (findDeviceErr) {
        callback(findDeviceErr);
        return;
      }

      if (!device) {
        callback(null, `Device with DeviceID ${deviceID} not found`);
        return;
      }

      const { _id } = device;
      // Remove device from dataCollection using _id
      dataCollection.remove({ _id: _id }, (dataRemoveErr, dataRemoveResult) => {
        if (dataRemoveErr) {
          callback(dataRemoveErr);
          return;
        }

        // Remove device from configCollection using _id
        configCollection.remove({ _id: _id }, (configRemoveErr, configRemoveResult) => {
          if (configRemoveErr) {
            callback(configRemoveErr);
            return;
          }

          callback(null, `Device with DeviceID ${deviceID} removed from dataCollection and configCollection`);
        });
      });
    });
  });
};

// Function to add an alarm to the alarmCollection
const addAlarm = (db, labApi, alarmObject, callback) => {
  const alarmCollection = getCollection(db, `${labApi}_alarmCollection`);

  // Find the last alarm in the collection
  alarmCollection
    .find({})
    .sort({ AlarmID: -1 })
    .limit(1)
    .toArray((findErr, lastAlarm) => {
      if (findErr) {
        console.error('Error finding last alarm:', findErr);
        callback(findErr);
        return;
      }

      // Increment the AlarmID or set it to 1 if there are no alarms
      alarmObject.AlarmID = lastAlarm.length > 0 ? lastAlarm[0].AlarmID + 1 : 1;

      // Insert the new alarm into the collection
      alarmCollection.insert(alarmObject, (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Error adding alarm to collection:', insertErr);
          callback(insertErr);
          return;
        }

        callback(null, 'Alarm added to alarmCollection');
      });
    });
};

const editAlarm = (db, labApi, updatedAlarm, callback) => {
  const alarmCollection = getCollection(db, `${labApi}_alarmCollection`);
  const { AlarmID } = updatedAlarm;

  alarmCollection.update({ AlarmID }, { $set: updatedAlarm }, (err, result) => {
      if (err) {
          console.error(err);
          callback(err);
      }

      if (result.nModified === 0) {
          callback(null, `Alarm with AlarmID ${AlarmID} not found`);
      } else {
          callback(null, `Alarm with AlarmID ${AlarmID} updated successfully`);
      }
  });
};

const removeAlarm = (db, labApi, alarmID, callback) => {
  const alarmCollection = getCollection(db, `${labApi}_alarmCollection`);

  // Convert alarmID to an integer
  const parsedAlarmID = parseInt(alarmID, 10);

  alarmCollection.remove({ "AlarmID": parsedAlarmID }, (err, result) => {
      if (err) {
          console.error(err);
          callback(err);
      }

      if (result.deletedCount === 0) {
          callback(null, `Alarm with AlarmID ${parsedAlarmID} not found`);
      } else {
          callback(null, `Alarm with AlarmID ${parsedAlarmID} removed successfully`);
      }
  });
};




module.exports = {
  connectToDatabase,
  initializeLabs,
  login,
  getCollection,
  insertTestData,
  getAllConfig,
  editDeviceConfig,
  getAllAlarms,
  removeDevice,
  getAllHomePageData,
  addAlarm,
  editAlarm,
  removeAlarm
};
