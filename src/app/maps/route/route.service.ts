import {Injectable} from '@angular/core';
import {DistanceEntry} from '../distance-matrix';

@Injectable()
export class RouteService {
  getRoundTrip(entries: DistanceEntry[]): DistanceEntry[] {
    let roundTrip: DistanceEntry[] = [];
    let fromIndex = 0;
    let abort: boolean = false;
    let unvisitedEntries: DistanceEntry[] = this.removeTripBack(entries);
    while(unvisitedEntries.length > 0 && !abort) {
      let size: number = unvisitedEntries.length;
      // console.log("from unvisitedEntries: " + fromIndex);
      // console.log("unvisitedEntries length: " + unvisitedEntries.length);
      // console.dir(unvisitedEntries);
      let fromEntries: DistanceEntry[] = this.getEntriesFrom(fromIndex, unvisitedEntries);
      // console.log("fromentries:");
      // console.dir(fromEntries);
      if (fromEntries.length > 0) {
        let nextEntry: DistanceEntry = this.getShortestDistance(fromEntries);
        // console.log("next Entry:");
        // console.dir(nextEntry);
        roundTrip.push(nextEntry);
        unvisitedEntries = this.removeVisited(fromIndex, unvisitedEntries);
        fromIndex = nextEntry.toIndex;
      }
      if (size == unvisitedEntries.length) {
        abort = true;
      }
    }
    if (entries.length > 0) {
      roundTrip.push(entries.filter(el => el.fromIndex == fromIndex && el.toIndex == 0)[0]);
    }
    return roundTrip;
  }

  private removeTripBack(entries: DistanceEntry[]) {
    return entries.filter(el => el.toIndex != 0);
  }

  private getEntriesFrom(fromIndex: number, entries: DistanceEntry[]): DistanceEntry[] {
    return entries.filter(el => el.fromIndex == fromIndex);
  }

  private getShortestDistance(entries: DistanceEntry[]): DistanceEntry {
    return entries.reduce((prev, curr) => prev.distance < curr.distance ? prev : curr);
  }

  private removeVisited(fromIndex: number, entries: DistanceEntry[]) {
    return entries.filter(el => el.fromIndex != fromIndex && el.toIndex != fromIndex);
  }

  private
}
