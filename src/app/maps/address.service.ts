/// <reference path="./../../../node_modules/@types/google-maps/index.d.ts" />

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/bindCallback';

@Injectable()
export class AddressService {

  private autocompleteService: any;

  constructor() {
    //noinspection TypeScriptUnresolvedVariable
    this.autocompleteService= new google.maps.places.AutocompleteService();
  }

  getSuggestions(place: string): Observable<Place[]> {
    let autoCompleat: any = Observable.bindCallback(this.autocompleteService.getPlacePredictions.bind(this.autocompleteService), res => res);
    let result: Observable<any> = autoCompleat({input: place});
    console.dir(result);
    return result.map(resp => this.extractData(resp));
  }

  private extractData(response: any) {
    console.dir(response);
    let suggestions = [];
    if (response) {
      suggestions = response.map((prediction) => {
        return {name: prediction.description}
      });
    }
    return suggestions;
  }
}

export interface Place {
  name: string,
  id: string
}
