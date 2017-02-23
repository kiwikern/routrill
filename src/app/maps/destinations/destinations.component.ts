import {Component, OnInit} from '@angular/core';
import {Place, AddressService} from '../address.service';
import {Observable, Subject} from 'rxjs';
import {MdSnackBar} from '@angular/material';
import {DistanceService} from '../distance.service';

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.component.html',
  styleUrls: ['./destinations.component.css']
})
export class DestinationsComponent implements OnInit {

  private locations: Place[] = [];
  private distance: Observable<number>;
  private suggestions: Observable<Place[]>;
  private placeSearchStream: Subject<string> = new Subject<string>();

  constructor(private snackBar: MdSnackBar,
              private service: AddressService,
              private distanceService: DistanceService) {
  }


  addLocation(location: Place) {
    if (this.locations.indexOf(location) != -1) {
      this.showSnackbar('Destination has already been added.');
    } else if (this.locations.length >= 10) {
      this.showSnackbar('The maximum of 10 destinations has been reached.');
    } else {
      this.locations.push(location);
    }
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
    let config: any = {duration: 3000};
    this.snackBar.open(message, '', config);
  }

  ngOnInit() {
    let destinations = JSON.parse(localStorage.getItem('tsp.destinations'));
    if (destinations) {
      this.locations = destinations;
    }

    this.suggestions = this.placeSearchStream
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((place: string) => place ? this.service.getSuggestions(place) : Observable.of<Place[]>([]))
      .catch(error => {
        console.log(error);
        return Observable.of<Place[]>([]);
      });
  }

  getSuggestions(place: string) {
    this.placeSearchStream.next(place);
  }

  saveDestinationsLocally() {
    if (this.locations) {
      localStorage.setItem('tsp.destinations', JSON.stringify(this.locations));
      this.distance = this.distanceService.getDistance(this.locations, this.locations);
      this.showSnackbar("Your destinations have been saved locally.");
    }
  }

}
