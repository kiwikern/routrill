import {Component, OnInit} from '@angular/core';
import {AddressService, Place} from '../address.service';
import {Subject, Observable} from 'rxjs';

@Component({
  selector: 'app-address-selector',
  templateUrl: './address-selector.component.html',
  styleUrls: ['./address-selector.component.css']
})
export class AddressSelectorComponent implements OnInit {

  private placeSearchStream: Subject<string> = new Subject<string>();
  private suggestions: Observable<Place[]>;

  constructor(private service: AddressService) {
  }

  getSuggestions(place: string) {
    // console.log(place);
    this.placeSearchStream.next(place);
  }

  ngOnInit() {
    this.suggestions = this.placeSearchStream
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((place: string) => this.service.getSuggestions(place));
  }

}
