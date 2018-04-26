import { Injectable } from '@angular/core';
import { DistanceEntry } from '../../../../worker/distance-matrix';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
/**
 * Calculates round trips for given DistanceEntries using different heuristics.
 */
export class RouteService {

  bruteforceWorker: Worker;
  farthestNeighborWorker: Worker;
  nearestNeighborWorker: Worker;
  mstWorker: Worker;

  constructor() {
    this.bruteforceWorker = new Worker('worker/bruteforce-worker.js');
    this.farthestNeighborWorker = new Worker('worker/neighbor-worker.js');
    this.nearestNeighborWorker = new Worker('worker/neighbor-worker.js');
    this.mstWorker = new Worker('worker/mst-worker.js');
  }


  public getFarthestNeighborRoundTrip(entries: DistanceEntry[]): Observable<DistanceEntry[]> {
    return this.getWorkerResult(this.farthestNeighborWorker, entries, 'FN');
  }

  public getNearestNeighborRoundTrip(entries: DistanceEntry[]): Observable<DistanceEntry[]> {
    return this.getWorkerResult(this.nearestNeighborWorker, entries, 'NN');
  }

  public getMSTRoundTrip(entries: DistanceEntry[]): Observable<DistanceEntry[]> {
    return this.getWorkerResult(this.mstWorker, entries);
  }

  public getBruteRoundTrip(entries: DistanceEntry[]): Observable<DistanceEntry[]> {
    return this.getWorkerResult(this.bruteforceWorker, entries);
  }


  private getWorkerResult(worker: Worker, entries: DistanceEntry[], type?: string): Observable<DistanceEntry[]> {
    worker.postMessage({distanceMatrix: entries, type});
    const result: Subject<DistanceEntry[]> = new Subject();
    worker.onmessage = message => result.next(message.data);
    return result;
  }
}
