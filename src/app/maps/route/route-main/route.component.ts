import {Component, OnInit} from '@angular/core';
import {DistanceMatrix, DistanceEntry} from '../services/distance-matrix';
import {Observable} from 'rxjs';
import {DistanceService} from '../services/distance.service';
import {MdDialog} from '@angular/material';
import {RouteSection} from '../route-section/route-section';
import {NeighborRouteService} from '../services/neighbor-route.service';
import {ConfirmDialogComponent} from '../../../util/confirm-dialog/confirm-dialog.component';
import {MstRouteService} from '../services/mst-route.service';
import {BruteRouteService} from '../services/brute-route.service';

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
  private roundTripBrute: DistanceEntry[] = [];
  private stopsInOrder: string[] = [];
  private totalDistance: number = 0;


  constructor(private dialog: MdDialog,
              private neighborRouteService: NeighborRouteService,
              private mstRouteService: MstRouteService,
              private bruteRouteService: BruteRouteService,
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

  getBruteRoute() {
    this.roundTrip = this.roundTripBrute;
    this.updateTable();
  }

  updateTable() {
    this.stopsInOrder = this.roundTrip.map(t => this.destinations[t.fromIndex]);
    this.totalDistance = Math.round(this.roundTrip.reduce((first, snd) => first + snd.distance, 0) / 1000)
  }

  ngOnInit() {
    let hasChanged: boolean = JSON.parse(localStorage.getItem('tsp.hasChanged')) != false;
    this.destinations = JSON.parse(localStorage.getItem('tsp.destinations'));
    if (!hasChanged) {
      this.loadFromLocalStorage();
    } else {
      this.getRoundTrips(this.destinations);
    }
  }

  private loadFromLocalStorage() {
    this.roundTripNN = JSON.parse(localStorage.getItem('tsp.roundTripNN'));
    this.roundTripFN = JSON.parse(localStorage.getItem('tsp.roundTripFN'));
    this.roundTripMST = JSON.parse(localStorage.getItem('tsp.roundTripMST'));
    this.roundTripBrute = JSON.parse(localStorage.getItem('tsp.roundTripBrute'));
  }

  private getRoundTrips(destinations) {
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
      this.roundTripBrute = this.bruteRouteService.getRoundTrip(matrix.distanceEntries);
      this.saveToLocalStorage();
    } else {
      this.sanityCheck(destinations, matrix);
    }
  }

  private sanityCheck(destinations, matrix) {
    let nonReachable: DistanceEntry[] = matrix.distanceEntries.filter(e => !e.isReachable);
    if (nonReachable && nonReachable.length > 0) {
      let destA = destinations[nonReachable[0].fromIndex];
      let destB = destinations[nonReachable[0].toIndex];
      this.showDialog(`No possible route between "${destA}" and "${destB}".\nRemove one of them.`);
    } else {
      this.showDialog('Routes could not be calulated.\nCheck Destinations.');
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('tsp.roundTripNN', JSON.stringify(this.roundTripNN));
    localStorage.setItem('tsp.roundTripFN', JSON.stringify(this.roundTripFN));
    localStorage.setItem('tsp.roundTripMST', JSON.stringify(this.roundTripMST));
    localStorage.setItem('tsp.roundTripBrute', JSON.stringify(this.roundTripBrute));
    localStorage.setItem('tsp.hasChanged', JSON.stringify(false));
  }

}
