import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DistanceEntry, DistanceMatrix } from '../../../route-algorithms/distance-matrix';
import { Observable } from 'rxjs/Observable';
import { RouteService } from '../services/route.service';
import { ObservableMedia } from '@angular/flex-layout';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DestinationService } from '../../destinations/destination.service';

/**
 * Calculate routes with all algorithms.
 * Let the user select which route to view.
 */
@Component({
  selector: 'tsp-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteComponent implements OnInit {

  public roundTrip$: Observable<DistanceEntry[]>;
  public isXSLayout = false;
  public destinations: string[] = [];
  public roundTripNN$: Observable<DistanceEntry[]>;
  public roundTripFN$: Observable<DistanceEntry[]>;
  public roundTripMST$: Observable<DistanceEntry[]>;
  public roundTripBrute$: Observable<DistanceEntry[]>;


  constructor(private routeService: RouteService,
              private route: ActivatedRoute,
              private destinationService: DestinationService,
              private media: ObservableMedia) {
    this.media.asObservable()
      .pipe(map(change => change.mqAlias === 'xs'))
      .subscribe(isXs => this.isXSLayout = isXs);

  }

  ngOnInit() {
    this.roundTripNN$ = this.routeService.getNearestNeighborRoundTrip();
    this.roundTripFN$ = this.routeService.getFarthestNeighborRoundTrip();
    this.roundTripMST$ = this.routeService.getMSTRoundTrip();
    this.roundTripBrute$ = this.routeService.getBruteRoundTrip();
    this.destinations = this.destinationService.getDestinationNames();
    this.route.data.subscribe(data => this.getRoundTrip(data.distanceMatrix));
  }

  private getRoundTrip(matrix: DistanceMatrix) {
    this.routeService.calculateRoutes(matrix.distanceEntries);
  }

}
