import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Place } from '../../../../worker/place.interface';

@Component({
  selector: 'tsp-destinations-selector',
  templateUrl: './destinations-selector.component.html',
  styleUrls: ['./destinations-selector.component.css']
})
export class DestinationsSelectorComponent {
  @Input() suggestions: Observable<{name: string}[]>;
  @Output() locationUpdate = new EventEmitter<Place>();
  @Output() searchTerm = new EventEmitter<string>();
  location: Place = null;

  constructor() {
  }

  updateValue(value: string | Place) {
    if (typeof value === 'object' && value.name) {
      this.locationUpdate.emit(value);
      this.location = null;
    }
  }

  getSuggestions(place: string) {
    this.searchTerm.emit(place);
  }

  displayLocation(location: string): any {
    if (this.location && this.location.name) {
      return this.location.name;
    } else {
      return null;
    }
  }

}
