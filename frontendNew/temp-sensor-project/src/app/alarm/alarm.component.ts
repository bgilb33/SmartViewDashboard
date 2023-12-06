import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EditAlarmModalComponent } from '../edit-alarm-modal/edit-alarm-modal.component';
import { DeleteSensorModalComponent } from '../delete-sensor-modal/delete-sensor-modal.component';
import { AddAlarmModalComponent } from '../add-alarm-modal/add-alarm-modal.component';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent {
  alarms = [
    {
      AlarmID: 0,
      DeviceID: 2,
      DeviceName: "Lab Room 1",
      SensorType: "Temperature",
      Compare: ">",
      Threshold: "90.0",
      Status: "Deactivated"
    },
  ];

  editedAlarm: any;
  deletedAlarm: any;
  isModalOpen = false;
  modalRef: NgbModalRef | null = null;

  constructor(private modalService: NgbModal) {}

  openEditModal(sensor: any): void {
    this.editedAlarm = { ...sensor };
    this.modalRef = this.modalService.open(EditAlarmModalComponent, { centered: true, size: 'lg' });
    this.modalRef.componentInstance.editedAlarm = this.editedAlarm;

    // Subscribe to the close and saveChanges events
    this.modalRef.componentInstance.closeModalEvent.subscribe(() => this.closeModal());
    this.modalRef.componentInstance.saveChangesEvent.subscribe((formData: any) => this.saveChanges(formData));

    this.isModalOpen = true;
  }

  openDeleteModal(sensor: any): void {
    this.deletedAlarm = { ...sensor };
    this.modalRef = this.modalService.open(DeleteSensorModalComponent, { centered: true, size: 'lg' });
    this.modalRef.componentInstance.deletedSensor = this.deletedAlarm;

    // Subscribe to the close and deleteSensor events
    this.modalRef.componentInstance.closeModalEvent.subscribe(() => this.closeModal());
    this.modalRef.componentInstance.deleteSensorEvent.subscribe(() => this.deleteSensor());

    this.isModalOpen = true;
  }

  openAlarmModal(): void {
    this.modalRef = this.modalService.open(AddAlarmModalComponent, { centered: true, size: 'lg' });
    
    this.modalRef.componentInstance.addAlarmEvent.subscribe((formData:any) => this.addAlarm(formData));
    this.modalRef.componentInstance.closeModalEvent.subscribe(() => this.closeModal());
    this.isModalOpen = true;
  }



  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.isModalOpen = false;
    }
  }

  saveChanges(formData: any): void {
    const index = this.alarms.findIndex(alarm => alarm.AlarmID === this.editedAlarm.AlarmID);

    if (index !== -1) {
      this.alarms[index] = { ...formData };
    }

    console.log(this.alarms);

    this.closeModal();
  }

  deleteSensor(): void {
    const index = this.alarms.findIndex(alarm => alarm.AlarmID === this.deletedAlarm.AlarmID);

    if (index !== -1) {
      this.alarms.splice(index, 1);
    }

    console.log(this.alarms);

    this.closeModal();
  }

  addAlarm(formData:any): void {
    const index = this.alarms.length;
    formData.AlarmID = index;
    this.alarms.push(formData);
    console.log(formData);
    this.closeModal();

  }

  editAlarm(alarm: any): void {
    this.openEditModal(alarm);
  }

  deleteAlarm(alarm: any): void {
    this.openDeleteModal(alarm);
  }
}
