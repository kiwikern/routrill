import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Place } from '../../../route-algorithms/place.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  selector: 'tsp-destinations-selector',
  templateUrl: './destinations-selector.component.html',
  styleUrls: ['./destinations-selector.component.css']
})
export class DestinationsSelectorComponent {
  @Input() suggestions: Observable<{ name: string }[]>;
  @Output() locationUpdate = new EventEmitter<Place>();
  @Output() searchTerm = new EventEmitter<string>();

  constructor() {
  }

  /**
   * Emit an output event when a location is selected from the suggestions.
   * @param {string | Place} value
   */
  emitOptionSelected(event: MatAutocompleteSelectedEvent) {
    const location = event.option.value;
    if (location && location.name) {
      this.locationUpdate.emit(location);
    }
  }

  /**
   * Retrieve suggestions from the Google Place API.
   * @param {string} place
   */
  getSuggestions(place: string) {
    this.searchTerm.emit(place);
  }

  /**
   * Clear out the input, so that a new location can be added.
   * @param {string} location: unused
   * @returns {any}
   */
  displayLocation(location: Place): any {
    return null;
  }

}
