// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { DeviceConfigComponent } from './device-config/device-config.component';
import { AlarmComponent } from './alarm/alarm.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'config', component: DeviceConfigComponent, canActivate: [AuthGuard]},
  { path: 'alarm', component: AlarmComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // Remove this if you don't need route tracing
    ),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
