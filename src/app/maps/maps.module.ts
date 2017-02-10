import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressSelectorComponent } from './address-selector/address-selector.component';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {
    path: 'select-address',
    component: AddressSelectorComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddressSelectorComponent]
})
export class MapsModule { }
