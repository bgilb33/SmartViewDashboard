const { MongoClient } = require('mongodb');

async function getRecentTemperatureReadings(sensorValue, limit = 20) {
    const uri = 'mongodb+srv://bgilb33:GbGb302302!@labsensordb.drzhafh.mongodb.net/?retryWrites=true&w=majority';
    const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('test');
    const collection = database.collection('niaLab_TimeSeries');

    // Query for the most recent 20 temperature readings for the specified sensor value
    const query = {
      'metadata.sensor': sensorValue
    };

    const options = {
      sort: { timestamp: -1 }, // Sort by timestamp in descending order
      limit: limit // Limit the result to the specified number of documents
    };

    const result = await collection.find(query, options).toArray();

    // Transform the result into the desired data structure
    const transformedData = result.map(entry => ({
      timestamp: entry.timestamp,
      temperature: entry.temperature
    }));

    // Print the transformed data (optional)
    console.log('Transformed Data:', transformedData);

    return transformedData;
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}
// getRecentTemperatureReadings(1);

// Example usage
module.exports = { getRecentTemperatureReadings }