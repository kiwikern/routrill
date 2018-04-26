import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {DistanceMatrix} from '../../../../worker/distance-matrix';
import {bindCallback} from 'rxjs/observable/bindCallback';
import {map} from 'rxjs/operators';
import {BoundCallbackObservable} from 'rxjs/observable/BoundCallbackObservable';

@Injectable()
export class DistanceService {

  private readonly distanceService;

  constructor() {
    this.distanceService = new google.maps.DistanceMatrixService();
  }

  getDistance(places: string[]): Observable<DistanceMatrix> {
    const getDistance: any = bindCallback(this.distanceService.getDistanceMatrix.bind(this.distanceService), res => res);
    const result: BoundCallbackObservable<any> = getDistance({origins: places, destinations: places, travelMode: 'DRIVING'});
    return result.pipe(map(res => new DistanceMatrix(res)));
  }


}
