import { Injectable } from '@angular/core';
import {BruteRouteService} from './brute-route.service';
import {MstRouteService} from './mst-route.service';
import {NeighborRouteService} from './neighbor-route.service';
import {DistanceEntry} from './distance-matrix';

@Injectable()
/**
 * Calculates round trips for given DistanceEntries using different heuristics.
 */
export class RouteService {

  constructor(private neighborRouteService: NeighborRouteService,
              private mstRouteService: MstRouteService,
              private bruteRouteService: BruteRouteService) { }


              public getFarthestNeighborRoundTrip(entries: DistanceEntry[]) {
                return this.neighborRouteService.getFNRoundTrip(entries);
              }

              public getNearestNeighborRoundTrip(entries: DistanceEntry[]) {
                return this.neighborRouteService.getNNRoundTrip(entries);
              }

              public getMSTRoundTrip(entries: DistanceEntry[]) {
                return this.mstRouteService.getRoundTrip(entries);
              }

              public getBruteRoundTrip(entries: DistanceEntry[]) {
                return this.bruteRouteService.getRoundTrip(entries);
              }
}
