import {Component, OnInit} from '@angular/core';
import {DistanceMatrix, DistanceEntry} from '../distance-matrix';
import {Observable} from 'rxjs';
import {DistanceService} from '../distance.service';
import {MdDialog} from '@angular/material';
import {RouteSection} from './route-section';
import {RouteService} from './route.service';
import {ConfirmDialogComponent} from '../../util/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

  private destinations: string[] = [];
  private roundTrip: DistanceEntry[] = [];
  private stopsInOrder: string[] = [];
  private totalDistance: number = 0;


  constructor(private dialog: MdDialog,
              private routeService: RouteService,
              private distanceService: DistanceService) {
  }

  showDialog(message: string) {
    let config: any = {data: {text: message, routePath: '/destinations', routeName: 'Edit Destinations'}};
    this.dialog.open(ConfirmDialogComponent, config);
  }

  getSection(entry: DistanceEntry) {
    let from = this.destinations[entry.fromIndex];
    let to = this.destinations[entry.toIndex];
    let distance = entry.distance;
    return new RouteSection(from, to, distance);
  }

  getNearestNeighborRoute() {

  }

  ngOnInit() {
    let destinations: string[] = JSON.parse(localStorage.getItem('tsp.destinations'));
    if (destinations && destinations.length > 1) {
      let distances: Observable<DistanceMatrix> = this.distanceService.getDistance(destinations);
      distances.subscribe(matrix => this.destinations = matrix.destinations);
      distances.subscribe(matrix => this.getRoundTrip(destinations, matrix));
      distances.subscribe(() => this.stopsInOrder = this.roundTrip.map(t => this.destinations[t.fromIndex]));
      distances.subscribe(() => this.totalDistance = Math.round(this.roundTrip.reduce((first, snd) => first + snd.distance, 0) / 1000));
    } else if (destinations && destinations.length == 1) {
      this.showDialog("Only one destination found.\nAdd at least one.");
    } else {
      this.showDialog("No destinations found.\nAdd at least two.");
    }

  }

  private getRoundTrip(destinations, matrix) {
    if (matrix.hasRoute) {
      this.roundTrip = this.routeService.getRoundTrip(matrix.distanceEntries)
    } else {
      let nonReachable: DistanceEntry[] = matrix.distanceEntries.filter(e => !e.isReachable);
      let destA: string = ' ';
      let destB: string = ' ';
      if (nonReachable && nonReachable.length > 0) {
        destA = destinations[nonReachable[0].fromIndex];
        destB = destinations[nonReachable[0].toIndex];
      }
      this.showDialog(`No possible route between ${destA} and ${destB}.\nRemove one of them.`);
    }
  }

}
