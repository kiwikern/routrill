import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressSelectorComponent } from './destinations/destinations.component';
import {Routes, RouterModule} from '@angular/router';
import {MaterialModule} from '@angular/material';
import {AddressService} from './address.service';
import {APP_CONFIG} from '../app.config';
import {APP_CONFIG_IMPL} from '../app.config.impl';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DistanceService} from './distance.service';

const routes: Routes = [
  {
    path: 'destinations',
    component: AddressSelectorComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
    FlexLayoutModule
  ],
  declarations: [
    AddressSelectorComponent
  ],
  providers: [
    AddressService,
    DistanceService,
    {provide: APP_CONFIG, useValue: APP_CONFIG_IMPL}
  ]
})
export class MapsModule { }
