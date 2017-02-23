import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DestinationsComponent} from './destinations/destinations.component';
import {Routes, RouterModule} from '@angular/router';
import {MaterialModule} from '@angular/material';
import {AddressService} from './address.service';
import {APP_CONFIG} from '../app.config';
import {APP_CONFIG_IMPL} from '../app.config.impl';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DistanceService} from './distance.service';
import {AddressSelectorComponent} from './destinations/address-selector/address-selector.component';
import {FormsModule} from '@angular/forms';
import { RouteComponent } from './route/route.component';

const routes: Routes = [
  {
    path: 'destinations',
    component: DestinationsComponent
  },
  {
    path: 'route',
    component: RouteComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    FormsModule,
  ],
  declarations: [
    DestinationsComponent,
    AddressSelectorComponent,
    RouteComponent
  ],
  providers: [
    AddressService,
    DistanceService,
    {provide: APP_CONFIG, useValue: APP_CONFIG_IMPL}
  ]
})
export class MapsModule {
}
