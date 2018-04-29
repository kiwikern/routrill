import { Injectable, NgZone } from '@angular/core';
import { DistanceEntry } from '../../route-algorithms/distance-matrix';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
/**
 * Calculates round trips for given DistanceEntries using different heuristics.
 * Web workers are used for multi-threaded, non-blocking computations.
 * With #calculateRoutes() you can start the calculation of all heuristics.
 * You can subscribe to the results of the calculations with #get<Heuristic>RoundTrip().
 */
export class RouteService {

  bruteforceWorker: Worker;
  farthestNeighborWorker: Worker;
  nearestNeighborWorker: Worker;
  mstWorker: Worker;
  bruteforceResult$: Subject<DistanceEntry[]> = new ReplaySubject(1);
  farthestNeighborResult$: Subject<DistanceEntry[]> = new ReplaySubject(1);
  nearestNeighborResult$: Subject<DistanceEntry[]> = new ReplaySubject(1);
  mstResult$: Subject<DistanceEntry[]> = new ReplaySubject(1);
  isBruteWorkerRunning = false;

  constructor(private ngZone: NgZone) {
    // Initialize the workers
    this.bruteforceWorker = new Worker('app/route-algorithms/bruteforce-worker.js');
    this.farthestNeighborWorker = new Worker('app/route-algorithms/neighbor-worker.js');
    this.nearestNeighborWorker = new Worker('app/route-algorithms/neighbor-worker.js');
    this.mstWorker = new Worker('app/route-algorithms/mst-worker.js');

    // Populate Observables within zone for ChangeDetection to run
    this.bruteforceWorker.onmessage = message => {
      this.isBruteWorkerRunning = false;
      return ngZone.run(() => this.bruteforceResult$.next(message.data));
    };
    this.farthestNeighborWorker.onmessage = message => ngZone.run(() => this.farthestNeighborResult$.next(message.data));
    this.nearestNeighborWorker.onmessage = message => ngZone.run(() => this.nearestNeighborResult$.next(message.data));
    this.mstWorker.onmessage = message => ngZone.run(() => this.mstResult$.next(message.data));
  }

  /**
   * Calculate routes with all algorithms.
   * The results can be retrieved with the getter functions, e. g. #getMSTRoundTrip()
   * If an older bruteforce calculation is still running, it will be terminated first.
   * @param {DistanceEntry[]} distanceMatrix
   */
  public calculateRoutes(distanceMatrix: DistanceEntry[]) {
    // Initialize with null to prune old results
    this.bruteforceResult$.next(null);
    this.mstResult$.next(null);
    this.nearestNeighborResult$.next(null);
    this.farthestNeighborResult$.next(null);

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
    return this.farthestNeighborResult$;
  }

  public getNearestNeighborRoundTrip(): Observable<DistanceEntry[]> {
    return this.nearestNeighborResult$;
  }

  public getMSTRoundTrip(): Observable<DistanceEntry[]> {
    return this.mstResult$;
  }

  public getBruteRoundTrip(): Observable<DistanceEntry[]> {
    return this.bruteforceResult$;
  }

  /**
   * If BruteWorker is still running with an old request, it has to be terminated and recreated.
   */
  private recreateBruteWorker() {
    this.bruteforceWorker.terminate();
    this.bruteforceWorker = new Worker('route-algorithms/bruteforce-worker.js');
    this.bruteforceWorker.onmessage = message => this.ngZone.run(() => this.bruteforceResult$.next(message.data));
  }
}
