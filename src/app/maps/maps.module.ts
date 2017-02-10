import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressSelectorComponent } from './address-selector/address-selector.component';
import {Routes, RouterModule} from '@angular/router';
import {MaterialModule} from '@angular/material';
import {AddressService} from './address.service';
import {APP_CONFIG} from '../app.config';
import {APP_CONFIG_IMPL} from '../app.config.impl';

const routes: Routes = [
  {
    path: 'select-address',
    component: AddressSelectorComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AddressSelectorComponent
  ],
  providers: [
    AddressService,
    {provide: APP_CONFIG, useValue: APP_CONFIG_IMPL}
  ]
})
export class MapsModule { }
