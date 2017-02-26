import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/bindCallback';
import {DistanceMatrix} from './distance-matrix';

@Injectable()
export class DistanceService {

  private distanceService;

  constructor() {
    //noinspection TypeScriptUnresolvedVariable
    this.distanceService = new google.maps.DistanceMatrixService();
  }

  getDistance(places: string[]): Observable<DistanceMatrix> {
    const getDistance: any = Observable.bindCallback(this.distanceService.getDistanceMatrix.bind(this.distanceService), res => res);
    const result: any = getDistance({origins: places, destinations: places, travelMode: 'DRIVING'});
    return result.map(res => new DistanceMatrix(res));
  }


}
