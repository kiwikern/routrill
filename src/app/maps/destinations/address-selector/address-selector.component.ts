import {Component, OnInit, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs';
import {Place} from '../../address.service';
import {Output, Input} from '@angular/core/src/metadata/directives';

@Component({
  selector: 'app-address-selector',
  templateUrl: './address-selector.component.html',
  styleUrls: ['./address-selector.component.css']
})
export class AddressSelectorComponent {
  @Output() locationUpdate = new EventEmitter<Place>();
  @Output() searchTerm = new EventEmitter<string>();
  @Input() suggestions: Observable<Place[]>;
  location: Place = null;

  constructor() {
  }

  updateValue(value: string | Place) {
    if (typeof value === "object" && value.name) {
      this.locationUpdate.emit(value);
      this.location = null;
    }
  }

  getSuggestions(place: string) {
    this.searchTerm.emit(place);
  }

  displayLocation(location: Place): any {
    if (this.location && this.location.name) {
      return this.location.name;
    } else {
      return null;
    }
  }

}
