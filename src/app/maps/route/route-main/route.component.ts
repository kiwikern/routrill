import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DistanceEntry, DistanceMatrix } from '../../../../worker/distance-matrix';
import { Observable } from 'rxjs/Observable';
import { RouteService } from '../services/route.service';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DestinationService } from '../../destinations/destination.service';

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
    this.media.asObservable().pipe(filter((change: MediaChange) => change.mqAlias === 'xs'))
      .subscribe(() => this.isXSLayout = true);

    this.media.asObservable().pipe(filter((change: MediaChange) => change.mqAlias !== 'xs'))
      .subscribe(() => this.isXSLayout = false);
  }

  ngOnInit() {
    this.roundTripNN$ = this.routeService.getNearestNeighborRoundTrip();
    this.roundTripFN$ = this.routeService.getFarthestNeighborRoundTrip();
    this.roundTripMST$ = this.routeService.getMSTRoundTrip();
    this.roundTripBrute$ = this.routeService.getBruteRoundTrip();
    this.destinations = this.destinationService.getDestinations();
    this.route.data.subscribe(data => this.getRoundTrip(data.distanceMatrix));
  }

  private getRoundTrip(matrix: DistanceMatrix) {
    this.routeService.calculateRoutes(matrix.distanceEntries);
  }

}
