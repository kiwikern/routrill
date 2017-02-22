import {Injectable} from '@angular/core';
import {Place} from './address.service';

import {Observable} from 'rxjs';
import 'rxjs/add/observable/bindCallback';
@Injectable()
export class DistanceService {

  private distanceService;

  constructor() {
      this.distanceService = new google.maps.DistanceMatrixService();
  }

  getDistance(locationA: Place, locationB: Place) {
  let getDistance: any = Observable.bindCallback(this.distanceService.getDistanceMatrix.bind(this.distanceService), res => res);
    let result: any = getDistance({origins: [locationA.name], destinations: [locationB.name], travelMode: 'DRIVING'});
    console.dir(result);
    result.subscribe(res => console.log(res));
    return result.map(res => res.rows[0].elements[0].distance.value);
  }

}
