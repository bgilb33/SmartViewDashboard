import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  labName = "Benji's Lab"
  tempSensors = [
    {
      DeviceID: 0,
      DeviceName: "Lab Room 1",
      Time: 1701783780,
      Temperature: 89.0,
      Humidity: 67.2
    },
    {
      DeviceID: 1,
      DeviceName: "Lab Room 2",
      Time: 1701783780,
      Temperature: 92.7,
      Humidity: 55.3
    },
    {
      DeviceID: 2,
      DeviceName: "Snack Room 1",
      Time: 1701783780,
      Temperature: 78.3,
      Humidity: 44.4
    },
    {
      DeviceID: 3,
      DeviceName: "Fridge 1",
      Time: 1701783780,
      Temperature: 22.2,
      Humidity: 78
    },
    {
      DeviceID: 4,
      DeviceName: "Snack Room 2",
      Time: 1701783780,
      Temperature: 89.0,
      Humidity: 67.2
    },
    {
      DeviceID: 5,
      DeviceName: "Lab Room 3",
      Time: 1701783780,
      Temperature: 89.0,
      Humidity: 67.2
    }
  ]

  convertEpochToDateTime(epochTime: number): string {
    // Convert epoch time to milliseconds
    const date = new Date(epochTime * 1000);
    return date.toLocaleString('en-US', { timeZone: "America/New_York" });
  }
}
