/// <reference path="./../../../node_modules/@types/google-maps/index.d.ts" />

import {Injectable, Inject} from '@angular/core';
import {APP_CONFIG, AppConfig} from '../app.config';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/bindCallback';

@Injectable()
export class AddressService {

  private autocompleteService;

  constructor(@Inject(APP_CONFIG) private config: AppConfig,
              private http: Http) {
      this.autocompleteService = new google.maps.places.AutocompleteService();
  }

  getSuggestions(place: string): Observable<Place[]> {
    let autoCompleat : any = Observable.bindCallback(this.autocompleteService.getPlacePredictions.bind(this.autocompleteService), res => res);
    let result : any = autoCompleat({input: place});
    return result.map(resp => this.extractData(resp));
  }

  private extractData(response: any) {
    let suggestions = [];
    if(response) {
      suggestions = response.map((prediction) => {
        return {name: prediction.description, id: prediction.id}
      });
    }
    return suggestions;
  }
}

export interface Place {
  name: string,
  id: string
}
