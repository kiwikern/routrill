import { Injectable } from '@angular/core';
import { Place } from '../../../route-algorithms/place.interface';
import { bindCallback } from 'rxjs/observable/bindCallback';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import ElevationResult = google.maps.ElevationResult;

/**
 * Service for querying the Google Elevation API.
 */
@Injectable()
export class ElevationService {

  private readonly elevationService;

  constructor() {
    this.elevationService = new google.maps.ElevationService();
  }

  /**
   * Add elevation information to a given list of places.
   * It need latitude/longitude to query for elevation.
   * @param {Place[]} destinations
   * @returns {Observable<Place[]>}
   */
  addElevations(destinations: Place[]): Observable<Place[]> {
    const getElevations: any = bindCallback(this.elevationService.getElevationForLocations.bind(this.elevationService), res => res);
    return getElevations({locations: destinations.map(d => d.location)})
      .pipe(
        map((results: ElevationResult[]) => {
          results.forEach((result, i) => destinations[i].elevation = results[i].elevation);
          return destinations;
        })
      );
  }

}
