import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import 'rxjs/add/observable/bindCallback';
import {DistanceMatrix} from './distance-matrix';
@Injectable()
export class DistanceService {

  private distanceService;

  constructor() {
    //noinspection TypeScriptUnresolvedVariable
    this.distanceService = new google.maps.DistanceMatrixService();
  }

  getDistance(places: string[]) : Observable<DistanceMatrix> {
  let getDistance: any = Observable.bindCallback(this.distanceService.getDistanceMatrix.bind(this.distanceService), res => res);
    let result: any = getDistance({origins: places, destinations: places, travelMode: 'DRIVING'});
    console.dir(result);
    result.subscribe(res => console.log(res));
    return result.map(res => new DistanceMatrix(res));
  }


}
