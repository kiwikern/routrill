import {Component, OnInit} from '@angular/core';
import {DistanceMatrix, DistanceEntry} from '../services/distance-matrix';
import {Observable} from 'rxjs/Observable';
import {DistanceService} from '../services/distance.service';
import {MdDialog} from '@angular/material';
import {RouteSection} from '../route-section/route-section';
import {ConfirmDialogComponent} from '../../../util/confirm-dialog/confirm-dialog.component';
import {RouteService} from '../services/route.service';
import {ObservableMedia, MediaChange} from '@angular/flex-layout';

@Component({
  selector: 'tsp-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

  public roundTrip: DistanceEntry[] = [];
  public stopsInOrder: string[] = [];
  public totalDistance = 0;
  public isXSLayout = false;
  private destinations: string[] = [];
  private roundTripNN: DistanceEntry[] = [];
  private roundTripFN: DistanceEntry[] = [];
  private roundTripMST: DistanceEntry[] = [];
  private roundTripBrute: DistanceEntry[] = [];


  constructor(private dialog: MdDialog,
              private routeService: RouteService,
              private distanceService: DistanceService,
              private media: ObservableMedia) {
    media.asObservable()
      .filter((change: MediaChange) => change.mqAlias === 'xs')
      .subscribe(() => this.isXSLayout = true );

    media.asObservable()
      .filter((change: MediaChange) => change.mqAlias !== 'xs')
      .subscribe(() => this.isXSLayout = false );
  }

  showDialog(message: string, showButtons = true) {
    let config;
    if (showButtons) {
      config = {data: {title: 'Oops...', text: message, routePath: '/destinations', routeName: 'Edit Destinations'}};
    } else {
      config = {data: {title: 'Calculating...'}};
    }
    this.dialog.open(ConfirmDialogComponent, config);
  }

  getSection(entry: DistanceEntry) {
    const from = this.destinations[entry.fromIndex];
    const to = this.destinations[entry.toIndex];
    const distance = entry.distance;
    return new RouteSection(from, to, distance);
  }

  getNearestNeighborRoute() {
    this.roundTrip = this.roundTripNN;
    this.updateTable();
  }

  getFarthestNeighborRoute() {
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
    this.totalDistance = Math.round(this.roundTrip.reduce((first, snd) => first + snd.distance, 0) / 1000);
  }

  ngOnInit() {
    const hasChanged: boolean = JSON.parse(localStorage.getItem('tsp.hasChanged')) != false;
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

  private getRoundTrips(destinations: string[]) {
    if (destinations && destinations.length > 1) {
      const distances: Observable<DistanceMatrix> = this.distanceService.getDistance(destinations);
      distances.subscribe(matrix => this.destinations = matrix.destinations);
      distances.subscribe(matrix => this.getRoundTrip(destinations, matrix));
    } else if (destinations && destinations.length === 1) {
      this.showDialog('Only one destination found.\nAdd at least one.');
    } else {
      this.showDialog('No destinations found.\nAdd at least two.');
    }
  }

  private getRoundTrip(destinations: string[], matrix: DistanceMatrix) {
    if (matrix.hasRoute) {
      let timeout = 0;
      if (matrix.destinations.length > 8) {
        this.showDialog('Calculating...', false);
        timeout = 900;
      }
      setTimeout(() => {
        this.roundTripNN = this.routeService.getNearestNeighborRoundTrip(matrix.distanceEntries);
        this.roundTripFN = this.routeService.getFarthestNeighborRoundTrip(matrix.distanceEntries);
        this.roundTripMST = this.routeService.getMSTRoundTrip(matrix.distanceEntries);
        this.roundTripBrute = this.routeService.getBruteRoundTrip(matrix.distanceEntries);
        this.saveToLocalStorage();
        this.dialog.closeAll();
      }, timeout);
    } else {
      this.sanityCheck(destinations, matrix);
    }
  }

  private sanityCheck(destinations: string[], matrix: DistanceMatrix) {
    const nonReachable: DistanceEntry[] = matrix.distanceEntries.filter(e => !e.isReachable);
    if (nonReachable && nonReachable.length > 0) {
      const destA = destinations[nonReachable[0].fromIndex];
      const destB = destinations[nonReachable[0].toIndex];
      this.showDialog(`No possible route between '${destA}' and '${destB}'.\nRemove one of them.`);
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
