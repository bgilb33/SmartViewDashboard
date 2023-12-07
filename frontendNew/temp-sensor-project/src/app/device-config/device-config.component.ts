// device-config.component.ts

import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EditSensorModalComponent } from '../edit-sensor-modal/edit-sensor-modal.component';
import { DeleteSensorModalComponent } from '../delete-sensor-modal/delete-sensor-modal.component';

@Component({
  selector: 'app-device-config',
  templateUrl: './device-config.component.html',
  styleUrls: ['./device-config.component.css'],
})
export class DeviceConfigComponent {
  tempSensors = [
    {
      DeviceID: 0,
      DeviceName: 'Lab Room 1',
      Frequency: 7,
      Units: 'Hour'
    }
  ];
  editedSensor: any;
  deletedSensor: any;
  isModalOpen = false;
  modalRef: NgbModalRef | null = null;

  constructor(private modalService: NgbModal) {}

  openEditModal(sensor: any): void {
    this.editedSensor = { ...sensor };
    this.modalRef = this.modalService.open(EditSensorModalComponent, { centered: true, size: 'lg' });
    this.modalRef.componentInstance.editedSensor = this.editedSensor;

    // Subscribe to the close and saveChanges events
    this.modalRef.componentInstance.closeModalEvent.subscribe(() => this.closeModal());
    this.modalRef.componentInstance.saveChangesEvent.subscribe((formData: any) => this.saveChanges(formData));

    this.isModalOpen = true;
  }

  openDeleteModal(sensor: any): void {
    this.deletedSensor = { ...sensor };
    this.modalRef = this.modalService.open(DeleteSensorModalComponent, { centered: true, size: 'lg' });
    this.modalRef.componentInstance.deletedSensor = this.deletedSensor;

    // Subscribe to the deleteSensor and closeModal events
    this.modalRef.componentInstance.deleteSensorEvent.subscribe(() => this.deleteSensor());
    this.modalRef.componentInstance.closeModalEvent.subscribe(() => this.closeModal());

    this.isModalOpen = true;
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.isModalOpen = false;
    }
  }

  // EDIT W API
  saveChanges(formData: any): void {
    // Implement your logic to save changes to the sensor
    // Close the modal after saving changes
    const index = this.tempSensors.findIndex(sensor => sensor.DeviceID === this.editedSensor.DeviceID);
    console.log("INDEX: ", index);
    if (index !== -1) {
      this.tempSensors[index] = { ...formData };
    }

    console.log(formData);
    this.closeModal();
  }

  // DELETE W API
  deleteSensor(): void {
    // Implement your logic to delete the sensor
    // Close the modal after deleting the sensor
    const index = this.tempSensors.findIndex(sensor => sensor.DeviceID === this.deletedSensor.DeviceID);

    if (index !== -1) {
      this.tempSensors.splice(index, 1);
    }

    console.log(this.tempSensors);
    this.closeModal();
  }

  // Opens edit modal
  editDevice(sensor: any): void {
    this.openEditModal(sensor);
  }

  // Opens delete modal
  deleteDevice(sensor: any): void {
    this.openDeleteModal(sensor);
  }
}
