import { Injectable, NgZone } from '@angular/core';
import { DistanceEntry } from '../../../../worker/distance-matrix';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
/**
 * Calculates round trips for given DistanceEntries using different heuristics.
 * With #calculateRoutes() you can start the calculation of all heuristics.
 * You can subscribe to the results of the calculations with #get<Heuristic>RoundTrip().
 */
export class RouteService {

  bruteforceWorker: Worker;
  bruteforceResult: Subject<DistanceEntry[]> = new ReplaySubject(1);
  farthestNeighborWorker: Worker;
  farthestNeighborResult: Subject<DistanceEntry[]> = new ReplaySubject(1);
  nearestNeighborWorker: Worker;
  nearestNeighborResult: Subject<DistanceEntry[]> = new ReplaySubject(1);
  mstWorker: Worker;
  mstResult: Subject<DistanceEntry[]> = new ReplaySubject(1);
  isBruteWorkerRunning = false;

  constructor(private ngZone: NgZone) {
    this.bruteforceWorker = new Worker('worker/bruteforce-worker.js');
    this.farthestNeighborWorker = new Worker('worker/neighbor-worker.js');
    this.nearestNeighborWorker = new Worker('worker/neighbor-worker.js');
    this.mstWorker = new Worker('worker/mst-worker.js');

    // Populate Observables within zone for ChangeDetection to run
    this.bruteforceWorker.onmessage = message => {
      this.isBruteWorkerRunning = false;
      return ngZone.run(() => this.bruteforceResult.next(message.data));
    };
    this.farthestNeighborWorker.onmessage = message => ngZone.run(() => this.farthestNeighborResult.next(message.data));
    this.nearestNeighborWorker.onmessage = message => ngZone.run(() => this.nearestNeighborResult.next(message.data));
    this.mstWorker.onmessage = message => ngZone.run(() => this.mstResult.next(message.data));
  }

  public calculateRoutes(distanceMatrix: DistanceEntry[]) {
    // Initialize with null to prune old results
    this.bruteforceResult.next(null);
    this.mstResult.next(null);
    this.nearestNeighborResult.next(null);
    this.farthestNeighborResult.next(null);

    if (this.isBruteWorkerRunning) {
      this.recreateBruteWorker();
    }
    this.isBruteWorkerRunning = true;
    this.bruteforceWorker.postMessage({distanceMatrix});
    this.farthestNeighborWorker.postMessage({distanceMatrix, type: 'FN'});
    this.nearestNeighborWorker.postMessage({distanceMatrix, type: 'NN'});
    this.mstWorker.postMessage({distanceMatrix});
  }

  public getFarthestNeighborRoundTrip(): Observable<DistanceEntry[]> {
    return this.farthestNeighborResult;
  }

  public getNearestNeighborRoundTrip(): Observable<DistanceEntry[]> {
    return this.nearestNeighborResult;
  }

  public getMSTRoundTrip(): Observable<DistanceEntry[]> {
    return this.mstResult;
  }

  public getBruteRoundTrip(): Observable<DistanceEntry[]> {
    return this.bruteforceResult;
  }

  /**
   * If BruteWorker is still running with an old request, it has to be terminated and recreated.
   */
  private recreateBruteWorker() {
    this.bruteforceWorker.terminate();
    this.bruteforceWorker = new Worker('worker/bruteforce-worker.js');
    this.bruteforceWorker.onmessage = message => this.ngZone.run(() => this.bruteforceResult.next(message.data));
  }
}
