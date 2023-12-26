import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import * as moment from 'moment';

import 'chartjs-adapter-moment';
Chart.register(...registerables);

@Component({
  selector: 'app-graph-modal',
  templateUrl: './graph-modal.component.html',
  styleUrls: ['./graph-modal.component.css']
})
export class GraphModalComponent implements OnInit {
  @Input() selectedSensor: any;
  @Input() labApi: any;
  @Output() closeModalEvent = new EventEmitter<void>;

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chartData: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAllHistoricalDataForDevice(this.labApi, this.selectedSensor.DeviceID).subscribe(
      (response) => {
        if (response.success) {
          this.chartData = response.data;
          console.log(this.chartData);
          console.log("Temp Data: ", this.chartData.map(entry => entry.Temperature))
          console.log("Humidity Data: ", this.chartData.map(entry => entry.Humidity))
          console.log("Times: ", this.chartData.map(entry => new Date(entry.Time * 1000).toISOString()))
          this.createChart();
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  createChart(): void {
    const ctx = (this.chartCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
  
    if (ctx) {
      const formattedTimes = this.chartData.map(entry => moment(entry.Time * 1000).format('MM/DD HH:mm'));
  
      const config: ChartConfiguration = {
        type: 'line',
        data: {
          labels: formattedTimes,
          datasets: [
            {
              label: 'Temperature',
              data: this.chartData.map(entry => entry.Temperature),
              borderColor: 'red',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
            },
            {
              label: 'Humidity',
              data: this.chartData.map(entry => entry.Humidity),
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.1)',
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'category',
            },
            y: {
              type: 'linear',
            },
          },
          plugins: {
            title: {
              display: true,
              text: `${this.selectedSensor.DeviceName} Data`,
              font: {
                size: 16,
              },
            },
            legend: {
              position: 'bottom',
            },
          },
          maintainAspectRatio: false, // Set to false to make the chart fill the container
          responsive: true, // Enable responsiveness
        },
      };
  
      const chartInstance = new Chart(ctx, config);
    }
  }
  
    
}
