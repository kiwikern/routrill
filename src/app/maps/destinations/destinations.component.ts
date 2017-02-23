import {Component, OnInit} from '@angular/core';
import {Place} from '../address.service';
import {Observable} from 'rxjs';
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

  constructor(private snackBar: MdSnackBar,
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
    if (this.locations.length >= 2) {
      this.distance = this.distanceService.getDistance(this.locations, this.locations);
    }
    this.saveDestinationsLocally();
  }

  removeLocation(location: Place) {
    let index = this.locations.indexOf(location);
    if (index == -1) {
      this.showSnackbar('Destination has already been removed.');
    } else {
      this.locations.splice(index, 1);
    }
    this.saveDestinationsLocally();
  }

  clearDestinations() {
    this.locations = [];
    this.saveDestinationsLocally();
  }

  showSnackbar(message: string) {
    let config: any = {duration: 1000};
    this.snackBar.open(message, '', config);
  }

  ngOnInit() {
    let destinations = JSON.parse(localStorage.getItem('tsp.destinations'));
    if (destinations) {
      this.locations = destinations;
    }
  }

  saveDestinationsLocally() {
    if (this.locations) {
      localStorage.setItem('tsp.destinations', JSON.stringify(this.locations));
    }
  }

}
