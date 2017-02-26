import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DestinationsComponent} from './destinations/destinations.component';
import {Routes, RouterModule} from '@angular/router';
import {MaterialModule} from '@angular/material';
import {AddressService} from './address.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DistanceService} from './distance.service';
import {AddressSelectorComponent} from './destinations/address-selector/address-selector.component';
import {FormsModule} from '@angular/forms';
import { RouteComponent } from './route/route.component';
import { RouteSectionComponent } from './route/route-section/route-section.component';
import {NeighborRouteService} from './route/neighbor-route.service';
import { RouteMapComponent } from './route/route-map/route-map.component';
import {UtilModule} from '../util/util.module';
import {ConfirmDialogComponent} from '../util/confirm-dialog/confirm-dialog.component';
import {MstRouteService} from './route/mst-route.service';
import {BruteRouteService} from './route/brute-route.service';

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
    UtilModule
  ],
  declarations: [
    DestinationsComponent,
    AddressSelectorComponent,
    RouteComponent,
    RouteSectionComponent,
    RouteMapComponent
  ],
  providers: [
    AddressService,
    DistanceService,
    NeighborRouteService,
    MstRouteService,
    BruteRouteService
  ],
  entryComponents: [ConfirmDialogComponent]
})
export class MapsModule {
}
