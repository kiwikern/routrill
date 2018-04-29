import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationsComponent } from './destinations/main/destinations.component';
import { RouterModule, Routes } from '@angular/router';
import { DestinationService } from './services/destination.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DistanceService } from './services/distance.service';
import { DestinationsSelectorComponent } from './destinations/selector/destinations-selector.component';
import { FormsModule } from '@angular/forms';
import { RouteComponent } from './route/route-main/route.component';
import { RouteMapComponent } from './route/route-map/route-map.component';
import { UtilModule } from '../util/util.module';
import { ConfirmDialogComponent } from '../util/confirm-dialog/confirm-dialog.component';
import { RouteService } from './services/route.service';
import { RouteResultComponent } from './route/route-result/route-result.component';
import { ElevationService } from './services/elevation.service';

export const GOOGLE = new InjectionToken('google');
export const googleFactory = () => google;

const routes: Routes = [
  {
    path: 'destinations',
    component: DestinationsComponent
  },
  {
    path: 'route',
    resolve: {
      distanceMatrix: DistanceService
    },
    component: RouteComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    FormsModule,
    UtilModule
  ],
  declarations: [
    DestinationsComponent,
    DestinationsSelectorComponent,
    RouteComponent,
    RouteMapComponent,
    RouteResultComponent
  ],
  providers: [
    DestinationService,
    DistanceService,
    RouteService,
    ElevationService,
    {provide: GOOGLE, useFactory: googleFactory}
  ],
  entryComponents: [ConfirmDialogComponent]
})
export class MapsModule {
}
