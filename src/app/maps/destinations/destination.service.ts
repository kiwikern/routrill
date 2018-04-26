import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { bindCallback } from 'rxjs/observable/bindCallback';

@Injectable()
export class DestinationService {

  private readonly autocompleteService: any;
  private destinations: string[] = [];

  constructor() {
    this.autocompleteService = new google.maps.places.AutocompleteService();
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

  getDestinations(): string[] {
    return this.destinations;
  }

  setDestinations(destinations: string[]) {
    this.destinations = destinations;
    localStorage.setItem('tsp.destinations', JSON.stringify(destinations));
  }

  private extractData(response: any) {
    let suggestions = [];
    if (response) {
      suggestions = response.map((prediction) => {
        return {name: prediction.description};
      });
    }
    return suggestions;
  }
}

export interface Place {
  name: string;
  id: string;
}
