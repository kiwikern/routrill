import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationsComponent } from './destinations/main/destinations.component';
import { RouterModule, Routes } from '@angular/router';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSnackBarModule
} from '@angular/material';
import { AddressService } from './destinations/destination.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DistanceService } from './route/services/distance.service';
import { DestinationsSelectorComponent } from './destinations/selector/destinations-selector.component';
import { FormsModule } from '@angular/forms';
import { RouteComponent } from './route/route-main/route.component';
import { RouteSectionComponent } from './route/route-section/route-section.component';
import { RouteMapComponent } from './route/route-map/route-map.component';
import { UtilModule } from '../util/util.module';
import { ConfirmDialogComponent } from '../util/confirm-dialog/confirm-dialog.component';
import { RouteService } from './route/services/route.service';
import { RouteResultComponent } from './route/route-result/route-result.component';

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
    RouterModule.forChild(routes),
    FlexLayoutModule,
    FormsModule,
    UtilModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    DestinationsComponent,
    DestinationsSelectorComponent,
    RouteComponent,
    RouteSectionComponent,
    RouteMapComponent,
    RouteResultComponent
  ],
  providers: [
    AddressService,
    DistanceService,
    RouteService
  ],
  entryComponents: [ConfirmDialogComponent]
})
export class MapsModule {
}
