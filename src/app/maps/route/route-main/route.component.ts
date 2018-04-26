import { Component, OnInit } from '@angular/core';
import { DistanceEntry, DistanceMatrix } from '../../../../worker/distance-matrix';
import { Observable } from 'rxjs/Observable';
import { DistanceService } from '../services/distance.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../../util/confirm-dialog/confirm-dialog.component';
import { RouteService } from '../services/route.service';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { filter } from 'rxjs/operators';
import 'rxjs/add/operator/share';

@Component({
  selector: 'tsp-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

  public roundTrip: Observable<DistanceEntry[]>;
  public isXSLayout = false;
  public destinations: string[] = [];
  public roundTripNN: Observable<DistanceEntry[]>;
  public roundTripFN: Observable<DistanceEntry[]>;
  public roundTripMST: Observable<DistanceEntry[]>;
  public roundTripBrute: Observable<DistanceEntry[]>;


  constructor(private dialog: MatDialog,
              private routeService: RouteService,
              private distanceService: DistanceService,
              private media: ObservableMedia) {
    this.media.asObservable().pipe(filter((change: MediaChange) => change.mqAlias === 'xs'))
      .subscribe(() => this.isXSLayout = true);

    this.media.asObservable().pipe(filter((change: MediaChange) => change.mqAlias !== 'xs'))
      .subscribe(() => this.isXSLayout = false);
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

  ngOnInit() {
    const hasChanged: boolean = JSON.parse(localStorage.getItem('tsp.hasChanged')) !== false;
    this.destinations = JSON.parse(localStorage.getItem('tsp.destinations'));
    // if (!hasChanged) {
    //   this.loadFromLocalStorage();
    // } else {
    this.getRoundTrips(this.destinations);
    // }
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
      distances.subscribe(matrix => {
        this.destinations = matrix.destinations;
        this.getRoundTrip(destinations, matrix)
      });
    } else if (destinations && destinations.length === 1) {
      this.showDialog('Only one destination found.\nAdd at least one.');
    } else {
      this.showDialog('No destinations found.\nAdd at least two.');
    }
  }

  private getRoundTrip(destinations: string[], matrix: DistanceMatrix) {
    if (matrix.hasRoute) {
      this.roundTripNN = this.routeService.getNearestNeighborRoundTrip(matrix.distanceEntries).share();
      this.roundTripFN = this.routeService.getFarthestNeighborRoundTrip(matrix.distanceEntries).share();
      this.roundTripMST = this.routeService.getMSTRoundTrip(matrix.distanceEntries).share();
      this.roundTripBrute = this.routeService.getBruteRoundTrip(matrix.distanceEntries).share();
      this.roundTripFN.subscribe(console.log);
      this.saveToLocalStorage();
      this.dialog.closeAll();
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
