import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/bindCallback';
import { map } from 'rxjs/operators';

@Injectable()
export class AddressService {

  private autocompleteService: any;

  constructor() {
    this.autocompleteService = new google.maps.places.AutocompleteService();
  }

  getSuggestions(place: string): Observable<Place[]> {
    const autoCompleat: any = Observable.bindCallback(this.autocompleteService.getPlacePredictions.bind(this.autocompleteService), res => res);
    const result: Observable<any> = autoCompleat({input: place});
    return result.pipe(map(resp => this.extractData(resp)));
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
