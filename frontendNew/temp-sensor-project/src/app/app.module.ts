// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LoginComponent } from './login/login.component';
import { DeviceConfigComponent } from './device-config/device-config.component';
import { EditSensorModalComponent } from './edit-sensor-modal/edit-sensor-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteSensorModalComponent } from './delete-sensor-modal/delete-sensor-modal.component';
import { AlarmComponent } from './alarm/alarm.component';
import { EditAlarmModalComponent } from './edit-alarm-modal/edit-alarm-modal.component';
import { DeleteDeviceModalComponent } from './delete-device-modal/delete-device-modal.component';
import { AddAlarmModalComponent } from './add-alarm-modal/add-alarm-modal.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CorsInterceptor } from './http-interceptor';
import { GraphModalComponent } from './graph-modal/graph-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavBarComponent,
    LoginComponent,
    DeviceConfigComponent,
    EditSensorModalComponent,
    DeleteSensorModalComponent,
    AlarmComponent,
    EditAlarmModalComponent,
    DeleteDeviceModalComponent,
    AddAlarmModalComponent,
    GraphModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: CorsInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
