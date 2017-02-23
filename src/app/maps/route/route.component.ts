import {Component, OnInit} from '@angular/core';
import {DistanceMatrix, DistanceEntry} from '../distance-matrix';
import {Observable} from 'rxjs';
import {DistanceService} from '../distance.service';
import {MdSnackBar} from '@angular/material';
import {RouteSection} from './route-section';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

  private destinations: string[] = [];
  private entries: DistanceEntry[] = [];


  constructor(private snackBar: MdSnackBar,
              private distanceService: DistanceService) {
  }

  showSnackbar(message: string) {
    let config: any = {duration: 3000};
    this.snackBar.open(message, '', config);
  }

  getSection(entry: DistanceEntry) {
    let from = this.destinations[entry.fromIndex];
    let to = this.destinations[entry.toIndex];
    let distance = entry.distance;
    return new RouteSection(from, to, distance);
  }

  ngOnInit() {
    let destinations = JSON.parse(localStorage.getItem('tsp.destinations'));
    if (destinations) {
      let distance: Observable<DistanceMatrix> = this.distanceService.getDistance(destinations);
      distance.subscribe(matrix => this.destinations = matrix.destinations);
      distance.subscribe(matrix => this.entries = matrix.distanceRows);
    } else {
      this.showSnackbar("No destinations found.")
    }

  }

}
