import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GraphModalComponent } from '../graph-modal/graph-modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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

  selectedSensor: any;
  isModalOpen = false;
  modalRef: NgbModalRef | null = null;

  constructor(
    private modalService: NgbModal,
    private apiService: ApiService,
    private authService: AuthService,
  ) {}

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
        (response) => {
          if (response.success) {
            this.tempSensors = response.data;
          }
          else {
            console.log(response.message);
          }
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
      (response) => {
        if (response.success) {
          this.tempSensors = response.data;
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  openGraphModal(sensor: any): void {
    this.selectedSensor = { ...sensor };
    this.modalRef = this.modalService.open(GraphModalComponent, { centered: true, size: 'lg' });
    this.modalRef.componentInstance.selectedSensor = this.selectedSensor;
    this.modalRef.componentInstance.labApi = this.labApi;

    // Subscribe to the close event
    this.modalRef.componentInstance.closeModalEvent.subscribe(() => this.closeModal());

    this.isModalOpen = true;
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.isModalOpen = false;
    }
  }

  convertEpochToDateTime(epochTime: number): string {
    const date = new Date(epochTime * 1000);
    return date.toLocaleString('en-US', { timeZone: 'America/New_York' });
  }
}
