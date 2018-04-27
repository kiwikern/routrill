import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, mergeMap } from 'rxjs/operators';
import { bindCallback } from 'rxjs/observable/bindCallback';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ElevationService } from '../route/services/elevation.service';
import { Place } from '../../../worker/place.interface';

@Injectable()
export class DestinationService {

  private readonly autocompleteService;
  private readonly placesService;
  private destinations: Place[] = [];

  constructor(private elevationService: ElevationService) {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    const div = document.createElement('div');
    this.placesService = new google.maps.places.PlacesService(div);
    const destinations = localStorage.getItem('tsp.destinations');
    if (destinations) {
      this.destinations = JSON.parse(destinations);
    }
  }

  getSuggestions(place: string): Observable<Place[]> {
    const autoCompleat: any = bindCallback(this.autocompleteService.getPlacePredictions.bind(this.autocompleteService), res => res);
    const result: Observable<any> = autoCompleat({input: place});
    return result.pipe(map(resp => this.extractData(resp)));
  }

  getDestinations(): Place[] {
    return this.destinations;
  }

  getDestinationNames(): string[] {
    return this.destinations.map(d => d.name);
  }

  setDestinations(destinations: Place[]) {
    forkJoin(destinations.map(p => this.addLatLng(p)))
      .pipe(mergeMap(d => this.elevationService.addElevations(d)))
      .subscribe(des => {
        this.destinations = des;
        localStorage.setItem('tsp.destinations', JSON.stringify(des));
      });
  }

  private extractData(response): Place[] {
    let suggestions = [];
    if (response) {
      suggestions = response.map((prediction) => {
        return {name: prediction.description, id: prediction.place_id};
      });
    }
    return suggestions;
  }

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

