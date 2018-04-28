import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestinationService } from '../destination.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { MatSnackBar } from '@angular/material';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Place } from '../../../route-algorithms/place.interface';

/**
 * View and edit the destinations. The destinations will be stored in localStorage.
 * A set of sample locations can be added.
 */
@Component({
  selector: 'tsp-destinations',
  templateUrl: './destinations.component.html',
  styleUrls: ['./destinations.component.css']
})
export class DestinationsComponent implements OnInit {

  public destinations: Place[] = [];
  public suggestions: Observable<Place[]>;
  private placeSearchStream: Subject<string> = new Subject<string>();

  constructor(private snackBar: MatSnackBar,
              private service: DestinationService,
              private destinationService: DestinationService,
              private changeDetection: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.destinations = this.destinationService.getDestinations();

    this.suggestions = this.placeSearchStream.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(place => place ? this.service.getPlaceSuggestions(place) : of([])),
      catchError(error => {
        console.error(error);
        this.showSnackbar('Something went wrong, sorry! Try again.');
        return of([]);
      }));
  }

  /**
   * A maximum of 10 destinations can be added.
   * @param {Place} location
   */
  addLocation(location: Place) {
    if (this.destinations.findIndex(p => p.id === location.id) !== -1) {
      this.showSnackbar('Destination has already been added.');
    } else if (this.destinations.length >= 10) {
      this.showSnackbar('The maximum of 10 destinations has been reached.');
    } else {
      this.destinations.push(location);
      this.saveDestinationsLocally();
    }
  }

  removeLocation(location: Place) {
    const index = this.destinations.findIndex(p => p.id === location.id);
    if (index === -1) {
      this.showSnackbar('Destination has already been removed.');
    } else {
      this.destinations.splice(index, 1);
      this.saveDestinationsLocally();
    }
  }

  clearDestinations() {
    this.destinations = [];
    this.saveDestinationsLocally();
  }

  showSnackbar(message: string) {
    const config: any = {duration: 3000};
    this.snackBar.open(message, '', config);
  }

  getSuggestions(place: string) {
    this.placeSearchStream.next(place);
    setTimeout(() => this.changeDetection.markForCheck(), 500);
  }

  saveDestinationsLocally() {
    if (this.destinations) {
      this.destinationService.setDestinations(this.destinations);
    }
  }

  getSampleDestinations() {
    this.destinations = [{
      'name': 'Berlin, Deutschland',
      'id': 'ChIJAVkDPzdOqEcRcDteW0YgIQQ',
      'location': {'lat': 52.52000659999999, 'lng': 13.404953999999975},
      'elevation': 36.18620300292969
    }, {
      'name': 'Köln, Deutschland',
      'id': 'ChIJ5S-raZElv0cR8HcqSvxgJwQ',
      'location': {'lat': 50.937531, 'lng': 6.960278600000038},
      'elevation': 49.99673461914062
    }, {
      'name': 'Warschau, Polen',
      'id': 'ChIJAZ-GmmbMHkcR_NPqiCq-8HI',
      'location': {'lat': 52.2296756, 'lng': 21.012228700000037},
      'elevation': 112.8618621826172
    }, {
      'name': 'München, Deutschland',
      'id': 'ChIJ2V-Mo_l1nkcRfZixfUq4DAE',
      'location': {'lat': 48.1351253, 'lng': 11.581980499999986},
      'elevation': 514.8603515625
    }, {
      'name': 'Pforzheim, Deutschland',
      'id': 'ChIJd6YPj-Jxl0cRQFMJjTz9HwQ',
      'location': {'lat': 48.8921862, 'lng': 8.694628599999987},
      'elevation': 261.7003784179688
    }, {
      'name': 'Hamburg, Deutschland',
      'id': 'ChIJuRMYfoNhsUcRoDrWe_I9JgQ',
      'location': {'lat': 53.5510846, 'lng': 9.993681899999956},
      'elevation': 5.680583000183105
    }, {
      'name': 'Dresden, Deutschland',
      'id': 'ChIJqdYaECnPCUcRsP6IQsuxIQQ',
      'location': {'lat': 51.05040880000001, 'lng': 13.737262099999953},
      'elevation': 112.8321151733398
    }, {
      'name': 'Bielefeld, Deutschland',
      'id': 'ChIJ8xmb4RE9ukcRzsfHbHK1P0w',
      'location': {'lat': 52.0302285, 'lng': 8.532470800000056},
      'elevation': 119.2644577026367
    }, {
      'name': 'Madrid, Spanien',
      'id': 'ChIJgTwKgJcpQg0RaSKMYcHeNsQ',
      'location': {'lat': 40.4167754, 'lng': -3.7037901999999576},
      'elevation': 647.6755981445312
    }];
    this.saveDestinationsLocally();
  }

}
