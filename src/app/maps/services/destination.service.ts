import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, mergeMap } from 'rxjs/operators';
import { bindCallback } from 'rxjs/observable/bindCallback';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ElevationService } from './elevation.service';
import { Place } from '../../route-algorithms/place.interface';
import { GOOGLE } from '../maps.module';

/**
 * Used for querying the Google Place API and storing selected destinations locally.
 */
@Injectable()
export class DestinationService {

  private readonly autocompleteService;
  private readonly placesService;
  private destinations: Place[] = [];

  constructor(private elevationService: ElevationService,
              @Inject(GOOGLE) google) {
    const div = document.createElement('div');
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(div);

    const destinations = localStorage.getItem('tsp.destinations');
    if (destinations) {
      this.destinations = JSON.parse(destinations);
    }
  }

  /**
   * Query the Google Places API for locations.
   * @param {string} place
   * @returns {Observable<Place[]>}
   */
  getPlaceSuggestions(place: string): Observable<Place[]> {
    const autoCompleat: any = bindCallback(this.autocompleteService.getPlacePredictions.bind(this.autocompleteService), res => res);
    const result: Observable<any> = autoCompleat({input: place});
    return result.pipe(map(resp => this.extractData(resp)));
  }

  /**
   * Get all destinations.
   * Destinations are stored in localStorage.
   * @returns {Place[]}
   */
  getDestinations(): Place[] {
    return this.destinations;
  }

  getDestinationNames(): string[] {
    return this.destinations.map(d => d.name);
  }

  /**
   * Destinations are stored in localStorage.
   * @param {Place[]} destinations
   */
  setDestinations(destinations: Place[]) {
    if (Array.isArray(destinations) && destinations.length === 0) {
      this.destinations = [];
      localStorage.setItem('tsp.destinations', JSON.stringify([]));
      return;
    }

    forkJoin(destinations.map(p => this.addLatLng(p)))
      .pipe(mergeMap(d => this.elevationService.addElevations(d)))
      .subscribe(des => {
        this.destinations = des;
        localStorage.setItem('tsp.destinations', JSON.stringify(des));
      });
  }

  /**
   * Extract relevant data from API response.
   * @param response Google Place API response
   * @returns {Place[]}
   */
  private extractData(response): Place[] {
    let suggestions = [];
    if (response) {
      suggestions = response.map((prediction) => {
        return {name: prediction.description, id: prediction.place_id};
      });
    }
    return suggestions;
  }

  /**
   * Add latitude and longitude to the place retrieved from Google.
   * Comes from a different Google Place API.
   * @param {Place} place
   * @returns {Observable<Place>}
   */
  private addLatLng(place: Place): Observable<Place> {
    if (place.location) {
      return of(place);
    }
    const getDetails: any = bindCallback(this.placesService.getDetails.bind(this.placesService), res => res);
    return getDetails({placeId: place.id}).pipe(map((response: any) => {
      const lat = response.geometry.location.lat();
      const lng = response.geometry.location.lng();
      return {name: place.name, id: place.id, location: {lat, lng}};
    }));
  }
}

