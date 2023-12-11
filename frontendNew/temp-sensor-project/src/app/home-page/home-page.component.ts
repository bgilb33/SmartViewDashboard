import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  labApi: any;
  labName: any = 'NIA Lab';
  tempSensors: any[] = [];
  private dataRefreshSubscription: Subscription | undefined;

  ngOnInit(): void {
    // Fetch labApi from AuthService
    this.labApi = this.authService.labApi;

    // Fetch initial data
    this.fetchData();

    // Set up periodic data refresh every 10 seconds
    this.dataRefreshSubscription = interval(10000)
      .pipe(
        switchMap(() => this.apiService.getHomePageData(this.labApi))
      )
      .subscribe(
        (homePageData) => {
          this.tempSensors = homePageData.data;
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  ngOnDestroy(): void {
    // Unsubscribe from the data refresh subscription to avoid memory leaks
    if (this.dataRefreshSubscription) {
      this.dataRefreshSubscription.unsubscribe();
    }
  }

  private fetchData(): void {
    this.apiService.getHomePageData(this.labApi).subscribe(
      (homePageData) => {
        this.tempSensors = homePageData.data;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  convertEpochToDateTime(epochTime: number): string {
    const date = new Date(epochTime * 1000);
    return date.toLocaleString('en-US', { timeZone: 'America/New_York' });
  }
}
