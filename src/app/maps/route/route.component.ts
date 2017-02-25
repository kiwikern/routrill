import {Component, OnInit} from '@angular/core';
import {DistanceMatrix, DistanceEntry} from '../distance-matrix';
import {Observable} from 'rxjs';
import {DistanceService} from '../distance.service';
import {MdDialog} from '@angular/material';
import {RouteSection} from './route-section';
import {NeighborRouteService} from './neighbor-route.service';
import {ConfirmDialogComponent} from '../../util/confirm-dialog/confirm-dialog.component';
import {MstRouteService} from './mst-route.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

  private destinations: string[] = [];
  private roundTrip: DistanceEntry[] = [];
  private roundTripNN: DistanceEntry[] = [];
  private roundTripFN: DistanceEntry[] = [];
  private roundTripMST: DistanceEntry[] = [];
  private stopsInOrder: string[] = [];
  private totalDistance: number = 0;


  constructor(private dialog: MdDialog,
              private neighborRouteService: NeighborRouteService,
              private mstRouteService: MstRouteService,
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
    this.roundTrip = this.roundTripNN;
    this.updateTable();
  }

  getFurthestNeighborRoute() {
    this.roundTrip = this.roundTripFN;
    this.updateTable();
  }

  getMstRoute() {
    this.roundTrip = this.roundTripMST;
    this.updateTable();
  }

  updateTable() {
    this.stopsInOrder = this.roundTrip.map(t => this.destinations[t.fromIndex]);
    this.totalDistance = Math.round(this.roundTrip.reduce((first, snd) => first + snd.distance, 0) / 1000)
  }

  ngOnInit() {
    let destinations: string[] = JSON.parse(localStorage.getItem('tsp.destinations'));
    if (destinations && destinations.length > 1) {
      let distances: Observable<DistanceMatrix> = this.distanceService.getDistance(destinations);
      distances.subscribe(matrix => this.destinations = matrix.destinations);
      distances.subscribe(matrix => this.getRoundTrip(destinations, matrix));
    } else if (destinations && destinations.length == 1) {
      this.showDialog("Only one destination found.\nAdd at least one.");
    } else {
      this.showDialog("No destinations found.\nAdd at least two.");
    }

  }

  private getRoundTrip(destinations, matrix) {
    if (matrix.hasRoute) {
      this.roundTripNN = this.neighborRouteService.getRoundTrip(matrix.distanceEntries);
      this.roundTripFN = this.neighborRouteService.getRoundTrip(matrix.distanceEntries, true);
      this.roundTripMST = this.mstRouteService.getRoundTrip(matrix.distanceEntries);
    } else {
      let nonReachable: DistanceEntry[] = matrix.distanceEntries.filter(e => !e.isReachable);
      let destA: string = ' ';
      let destB: string = ' ';
      if (nonReachable && nonReachable.length > 0) {
        destA = destinations[nonReachable[0].fromIndex];
        destB = destinations[nonReachable[0].toIndex];
      }
      this.showDialog(`No possible route between "${destA}" and "${destB}".\nRemove one of them.`);
    }
  }

}
