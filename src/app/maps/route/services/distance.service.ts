import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { DistanceEntry, DistanceMatrix } from '../../../../worker/distance-matrix';
import { bindCallback } from 'rxjs/observable/bindCallback';
import { map } from 'rxjs/operators';
import { BoundCallbackObservable } from 'rxjs/observable/BoundCallbackObservable';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmDialogComponent } from '../../../util/confirm-dialog/confirm-dialog.component';
import { DestinationService } from '../../destinations/destination.service';

@Injectable()
export class DistanceService implements Resolve<DistanceMatrix> {

  private readonly distanceService;

  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private destinationService: DestinationService,
              private router: Router) {
    this.distanceService = new google.maps.DistanceMatrixService();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DistanceMatrix> | DistanceMatrix {
    const destinations = this.destinationService.getDestinations();
    if (this.hasEnoughDestinations(destinations)) {
      const matrix$ = this.getDistance(destinations);
      matrix$.subscribe(m => !m.hasRoute ? this.showError(m) : null);
      return matrix$;
    } else {
      this.router.navigate(['destinations']);
    }
  }

  getDistance(places: string[]): Observable<DistanceMatrix> {
    const getDistance: any = bindCallback(this.distanceService.getDistanceMatrix.bind(this.distanceService), res => res);
    const result: BoundCallbackObservable<any> = getDistance({origins: places, destinations: places, travelMode: 'DRIVING'});
    return result.pipe(map(res => new DistanceMatrix(res)));
  }

  private showError(matrix: DistanceMatrix) {
    const destinations = this.destinationService.getDestinations();
    const nonReachable: DistanceEntry[] = matrix.distanceEntries.filter(e => !e.isReachable);
    this.router.navigate(['destinations']);
    if (nonReachable && nonReachable.length > 0) {
      const destA = destinations[nonReachable[0].fromIndex];
      const destB = destinations[nonReachable[0].toIndex];
      this.showDialog(`No possible route between '${destA}' and '${destB}'.\nRemove one of them.`);
    } else {
      this.showDialog('Routes could not be calculated.\nCheck Destinations.');
    }
  }

  private hasEnoughDestinations(destinations: string[]) {
    if (destinations && destinations.length > 1) {
      return true;
    } else if (destinations && destinations.length === 1) {
      this.showDialog('Only one destination found.\nAdd at least one more.');
    } else {
      this.showDialog('No destinations found.\nAdd at least two.');
    }
    return false;
  }

  private showDialog(message: string) {
    const config = {data: {title: 'Oops...', text: message, routeName: 'OK'}};
    this.dialog.open(ConfirmDialogComponent, config);
  }
}
