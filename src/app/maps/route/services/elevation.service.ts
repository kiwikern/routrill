import { Injectable } from '@angular/core';
import { Place } from '../../../../worker/place.interface';
import { bindCallback } from 'rxjs/observable/bindCallback';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import ElevationResult = google.maps.ElevationResult;

@Injectable()
export class ElevationService {

  private readonly elevationService;

  constructor() {
    this.elevationService = new google.maps.ElevationService();
  }

  addElevations(destinations: Place[]): Observable<Place[]> {
    console.log(destinations);
    const getElevations: any = bindCallback(this.elevationService.getElevationForLocations.bind(this.elevationService), res => res);
    return getElevations({locations: destinations.map(d => d.location)})
      .pipe(
        tap(console.log),
        map((results: ElevationResult[]) => {
          console.log(results);
          results.forEach((result, i) => destinations[i].elevation = results[i].elevation);
          return destinations;
        })
      );
  }

}
