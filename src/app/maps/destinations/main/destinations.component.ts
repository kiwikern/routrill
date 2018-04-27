import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestinationService, Place } from '../destination.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { MatSnackBar } from '@angular/material';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

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

  ngOnInit() {
    this.destinations = this.destinationService.getDestinations();

    this.suggestions = this.placeSearchStream.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((place: string) => place ? this.service.getSuggestions(place) : of<Place[]>([])),
      catchError(error => {
        console.error(error);
        this.showSnackbar('Something went wrong, sorry! Try again.');
        return of<Place[]>([]);
      }));
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
    const exampleDestinations: string[] = ['Berlin, Deutschland', 'Warschau, Polen', 'München, Deutschland',
      'Pforzheim, Deutschland', 'Hamburg, Deutschland', 'Dresden, Deutschland',
      'Göttingen, Deutschland', 'Bielefeld, Deutschland', 'Madrid, Spanien'];
    // this.destinations = exampleDestinations; TODO SampleDestinations as Location
    this.saveDestinationsLocally();
  }

}
