import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressSelectorComponent } from './address-selector/address-selector.component';
import {Routes, RouterModule} from '@angular/router';
import {MaterialModule} from '@angular/material';

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
  declarations: [AddressSelectorComponent]
})
export class MapsModule { }
