import {Injectable} from '@angular/core';
import {Place} from './address.service';

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

  getDistance(places: Place[]) : Observable<DistanceMatrix> {
  let getDistance: any = Observable.bindCallback(this.distanceService.getDistanceMatrix.bind(this.distanceService), res => res);
    let names = places.map(o => o.name);
    let result: any = getDistance({origins: names, destinations: names, travelMode: 'DRIVING'});
    console.dir(result);
    result.subscribe(res => console.log(res));
    return result.map(res => new DistanceMatrix(res));
  }


}
