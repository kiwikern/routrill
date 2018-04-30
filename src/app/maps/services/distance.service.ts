import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { DistanceEntry, DistanceMatrix } from '../../route-algorithms/distance-matrix';
import { bindCallback } from 'rxjs/observable/bindCallback';
import { catchError, map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmDialogComponent } from '../../util/confirm-dialog/confirm-dialog.component';
import { DestinationService } from './destination.service';
import { GOOGLE } from '../maps.module';
import { of } from 'rxjs/observable/of';

/**
 * Calculates the distance of given destinations by pairs.
 * Acts as a RouteResolver for the 'route' route resolving the DistanceMatrix data.
 */
@Injectable()
export class DistanceService implements Resolve<DistanceMatrix> {

  private readonly distanceService;

  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private destinationService: DestinationService,
              @Inject(GOOGLE) google,
              private router: Router) {
    this.distanceService = new google.maps.DistanceMatrixService();
  }

  /**
   * This resolves, when the distance are fetched from the Google API.
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<DistanceMatrix>}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DistanceMatrix> {
    const destinations = this.destinationService.getDestinationNames();
    if (!this.hasEnoughDestinations(destinations)) {
      this.router.navigate(['destinations']);
      return null;
    }
    return this.getDistance(destinations).pipe(
      catchError(error => this.showError(error))
    );
  }

  /**
   * Fetch a distance matrix from the Google API for given places.
   * @param {string[]} places
   * @returns {Observable<DistanceMatrix>}
   */
  private getDistance(places: string[]): Observable<DistanceMatrix> {
    const destinations = this.destinationService.getDestinations();
    const getDistance: ((v) => Observable<any>) = bindCallback(this.distanceService.getDistanceMatrix);
    const result = getDistance({origins: places, destinations: places, travelMode: 'DRIVING'});
    return result.pipe(
      map(res => {
        if (res[1] === 'OK') {
          return new DistanceMatrix(res[0], destinations);
        } else {
          throw new QueryLimitError(res[1]);
        }
      }),
      map(matrix => {
        const nonReachable: DistanceEntry[] = matrix.distanceEntries.filter(e => !e.isReachable);
        if (nonReachable && nonReachable.length > 0) {
          throw new NotReachableError(nonReachable[0].fromIndex, nonReachable[0].toIndex);
        } else {
          return matrix;
        }
      })
    );
  }

  /**
   * Display errors to user.
   */
  private showError(error: QueryLimitError | NotReachableError) {
    this.router.navigate(['destinations']);
    if (error instanceof NotReachableError) {
      const destinations = this.destinationService.getDestinationNames();
      const destA = destinations[error.fromIndex];
      const destB = destinations[error.toIndex];
      this.showDialog(`No possible route between '${destA}' and '${destB}'.\nRemove one of them.`);
    } else {
      this.showDialog('API limit reached.\nRetry in a couple of seconds.');
    }
    return of(null);
  }

  /**
   * Shows an error when less than two destinations are given.
   * @param {string[]} destinations
   * @returns {boolean}
   */
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

class QueryLimitError extends Error {
  // workaround for instanceof checks, see https://goo.gl/sgSAMm
  __proto__: QueryLimitError;

  constructor(reason) {
    const trueProto = new.target.prototype;
    super(reason);
    this.__proto__ = trueProto;

    console.warn('reached query limit', this);
  }
}

class NotReachableError extends Error {
  __proto__: NotReachableError;
  fromIndex;
  toIndex;

  constructor(fromIndex: number, toIndex: number) {
    const trueProto = new.target.prototype;
    super();
    this.fromIndex = fromIndex;
    this.toIndex = toIndex;
    this.__proto__ = trueProto;
  }
}
