import {Component, OnInit} from '@angular/core';
import {AddressService, Place} from '../address.service';
import {Observable, Subject} from 'rxjs';
import {MdSnackBar} from '@angular/material';

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.component.html',
  styleUrls: ['./destinations.component.css']
})
export class DestinationsComponent implements OnInit {

  private locations: string[] = [];
  private suggestions: Observable<Place[]>;
  private placeSearchStream: Subject<string> = new Subject<string>();

  constructor(private snackBar: MdSnackBar,
              private service: AddressService,) {
  }


  addLocation(location: string) {
    if (this.locations.indexOf(location) != -1) {
      this.showSnackbar('Destination has already been added.');
    } else if (this.locations.length >= 10) {
      this.showSnackbar('The maximum of 10 destinations has been reached.');
    } else {
      this.locations.push(location);
      this.saveDestinationsLocally();
    }
  }

  removeLocation(location: string) {
    let index = this.locations.indexOf(location);
    if (index == -1) {
      this.showSnackbar('Destination has already been removed.');
    } else {
      this.locations.splice(index, 1);
      this.saveDestinationsLocally();
    }
  }

  clearDestinations() {
    this.locations = [];
    this.saveDestinationsLocally();
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
      localStorage.setItem('tsp.hasChanged', JSON.stringify(true));
    }
  }

  getSampleDestinations() {
    const exampleDestinations: string[] =  ["Berlin, Deutschland","Warschau, Polen",  "München, Deutschland",
      "Pforzheim, Deutschland","Hamburg, Deutschland",  "Dresden, Deutschland",
      "Göttingen, Deutschland","Bielefeld, Deutschland","Madrid, Spanien"];
    this.locations = exampleDestinations;
    this.saveDestinationsLocally();
  }

}
