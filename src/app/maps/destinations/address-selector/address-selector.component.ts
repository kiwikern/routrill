import {Component, OnInit, EventEmitter} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Place, AddressService} from '../../address.service';
import {Output} from '@angular/core/src/metadata/directives';

@Component({
  selector: 'app-address-selector',
  templateUrl: './address-selector.component.html',
  styleUrls: ['./address-selector.component.css']
})
export class AddressSelectorComponent implements OnInit {
  @Output() locationUpdate = new EventEmitter<Place>();
  location: Place = null;
  private suggestions: Observable<Place[]>;
  private placeSearchStream: Subject<string> = new Subject<string>();

  constructor(private service: AddressService) {
  }

  ngOnInit() {
    this.suggestions = this.placeSearchStream
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((place: string) => place ? this.service.getSuggestions(place) : Observable.of<Place[]>([]))
      .catch(error => {
        console.log(error);
        return Observable.of<Place[]>([]);
      });

  }


  updateValue(value: string | Place) {
    if (typeof value === "object" && value.name) {
      this.locationUpdate.emit(value);
      this.location = null;
    }
  }

  getSuggestions(place: string) {
    this.placeSearchStream.next(place);
  }

  displayLocation(location: Place): any {
    if (this.location && this.location.name) {
      return this.location.name;
    } else {
      return null;
    }
  }

}
