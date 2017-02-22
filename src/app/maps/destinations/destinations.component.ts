import {Component, OnInit} from '@angular/core';
import {AddressService, Place} from '../address.service';
import {Subject, Observable} from 'rxjs';
import 'rxjs/add/operator/isEmpty'
import {MdSnackBar} from '@angular/material';
import {DistanceService} from '../distance.service';

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.component.html',
  styleUrls: ['./destinations.component.css']
})
export class AddressSelectorComponent implements OnInit {

  private placeSearchStream: Subject<string> = new Subject<string>();
  private suggestions: Observable<Place[]>;
  private locations: Place[] = [];
  private distance: Observable<number>;

  constructor(private service: AddressService,
              private snackBar: MdSnackBar,
              private distanceService: DistanceService) {
  }

  getSuggestions(place: string) {
    this.placeSearchStream.next(place);
  }

  addLocation(location: Place) {
    if (this.locations.indexOf(location) != -1) {
      this.showSnackbar('Destination has already been added.');
    } else if (this.locations.length >= 10) {
      this.showSnackbar('The maximum of 10 destinations has been reached.');
    } else {
      this.locations.push(location);
    }
    if (this.locations.length >= 2) {
      this.distance = this.distanceService.getDistance(this.locations[0], this.locations[1]);
    }
  }

  addEmptyLocation() {
    this.locations.push(null);
  }

  removeLocation(location: Place) {
    let index = this.locations.indexOf(location);
    if (index == -1) {
      this.showSnackbar('Destination has already been removed.');
    } else {
      this.locations.splice(index, 1);
    }
  }

  clearDestinations() {
    this.locations = [];
  }

  showSnackbar(message: string) {
    let config: any = {duration: 1000};
    this.snackBar.open(message, '', config);
  }

  displayLocation(location: Place): any {
    if (location) {
      return location.name;
    } else {
      return location;
    }
  }

  ngOnInit() {
    this.suggestions = this.placeSearchStream
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((place: string) => this.service.getSuggestions(place));
  }

}
