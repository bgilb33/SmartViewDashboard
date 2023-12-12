import Chart from 'chart.js/auto';
import { getRecentTemperatureReadings } from './databaseQuery'; // Adjust the path as needed

(async function () {
  try {
    // Assuming getRecentTemperatureReadings returns an array of objects with timestamp and temperature properties
    // const data = await getRecentTemperatureReadings(1);
    // console.log('Result:', data);

    getRecentTemperatureReadings(1, (data) => {
      console.log(data);
    });

    // new Chart(
    //   document.getElementById('acquisitions'),
    //   {
    //     type: 'bar',
    //     data: {
    //       labels: data.map(row => row.timestamp),
    //       datasets: [
    //         {
    //           label: 'Acquisitions by year',
    //           data: data.map(row => row.temperature)
    //         }
    //       ]
    //     }
    //   }
    // );
  } catch (error) {
    console.error('Error:', error);
  }
})();

