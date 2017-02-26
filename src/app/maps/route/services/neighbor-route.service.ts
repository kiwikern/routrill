import {Injectable} from '@angular/core';
import {DistanceEntry} from './distance-matrix';

@Injectable()
export class NeighborRouteService {
  getRoundTrip(entries: DistanceEntry[], furthest = false): DistanceEntry[] {
    const roundTrip: DistanceEntry[] = [];
    let fromIndex = 0;
    let abort = false;
    let unvisitedEntries: DistanceEntry[] = this.removeTripBack(entries);
    while (unvisitedEntries.length > 0 && !abort) {
      const size: number = unvisitedEntries.length;
      const fromEntries: DistanceEntry[] = this.getEntriesFrom(fromIndex, unvisitedEntries);
      if (fromEntries.length > 0) {
        let nextEntry: DistanceEntry;
        if (!furthest) {
          nextEntry = this.getShortestDistance(fromEntries);
        } else {
          nextEntry = this.getFurthestDistance(fromEntries);
        }
        roundTrip.push(nextEntry);
        unvisitedEntries = this.removeVisited(fromIndex, unvisitedEntries);
        fromIndex = nextEntry.toIndex;
      }
      if (size === unvisitedEntries.length) {
        abort = true;
      }
    }
    if (entries.length > 0) {
      roundTrip.push(entries.filter(el => el.fromIndex === fromIndex && el.toIndex === 0)[0]);
    }
    return roundTrip;
  }

  private removeTripBack(entries: DistanceEntry[]) {
    return entries.filter(el => el.toIndex !== 0);
  }

  private getEntriesFrom(fromIndex: number, entries: DistanceEntry[]): DistanceEntry[] {
    return entries.filter(el => el.fromIndex === fromIndex);
  }

  private getShortestDistance(entries: DistanceEntry[]): DistanceEntry {
    return entries.reduce((prev, curr) => prev.distance < curr.distance ? prev : curr);
  }

  private getFurthestDistance(entries: DistanceEntry[]): DistanceEntry {
    return entries.reduce((prev, curr) => prev.distance > curr.distance ? prev : curr);
  }

  private removeVisited(fromIndex: number, entries: DistanceEntry[]) {
    return entries.filter(el => el.fromIndex !== fromIndex && el.toIndex !== fromIndex);
  }

}
