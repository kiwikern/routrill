import {Component, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs';
import {Place} from '../destination.service';
import {Output, Input} from '@angular/core/src/metadata/directives';

@Component({
  selector: 'app-address-selector',
  templateUrl: './address-selector.component.html',
  styleUrls: ['./address-selector.component.css']
})
export class AddressSelectorComponent {
  @Output() locationUpdate = new EventEmitter<string>();
  @Output() searchTerm = new EventEmitter<string>();
  @Input() suggestions: Observable<string[]>;
  location: Place = null;

  constructor() {
  }

  updateValue(value: string | Place) {
    if (typeof value === "object" && value.name) {
      this.locationUpdate.emit(value.name);
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
