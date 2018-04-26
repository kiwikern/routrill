import { DistanceEntry } from './distance-matrix';

onmessage = function (e) {
  console.log('Received a message');
  const service = new NeighborRouteService();
  let result;
  if (e.data.type === 'FN') {
    result = service.getFNRoundTrip(e.data.distanceMatrix);
  } else {
    result = service.getNNRoundTrip(e.data.distanceMatrix);
  }
  postMessage(result);
};

class NeighborRouteService {

  /**
   * Given a distance matrix, returns a round trip calculated with the nearest neighbor heuristic.
   * @param entries - distance matrix
   * @returns {DistanceEntry[]}
   */
  getNNRoundTrip(entries: DistanceEntry[]) {
    return this.getRoundTrip(entries, this.getShortestTrip);
  }

  /**
   * Given a distance matrix, returns a round trip calculated with the farthest neighbor heuristic.
   * @param entries - distance matrix
   * @returns {DistanceEntry[]}
   */
  getFNRoundTrip(entries: DistanceEntry[]) {
    return this.getRoundTrip(entries, this.getLongestTrip);
  }

  /**
   * Given a distance matrix, returns a round trip calculated with a neighbor heuristic.
   * @param entries - distance matrix
   * @param nextEntryFn - function that returns next trip section
   * @returns {DistanceEntry[]}
   */
  private getRoundTrip(entries: DistanceEntry[], nextEntryFn): DistanceEntry[] {
    const roundTrip: DistanceEntry[] = [];
    let fromIndex = 0;
    let unvisitedEntries: DistanceEntry[] = this.removeTripBack(entries);
    while (unvisitedEntries.length > 0) {
      const fromEntries: DistanceEntry[] = this.getEntriesFrom(fromIndex, unvisitedEntries);
      if (fromEntries.length > 0) {
        let nextEntry: DistanceEntry;
        nextEntry = nextEntryFn(fromEntries);
        roundTrip.push(nextEntry);
        unvisitedEntries = this.removeVisited(fromIndex, unvisitedEntries);
        fromIndex = nextEntry.toIndex;
      }
    }
    if (entries.length > 0) {
      roundTrip.push(this.getTripBackToStart(entries, fromIndex));
    }
    return roundTrip;
  }

  /**
   * Given a distance matrix, returns the trip back to the start from a starting point.
   * @param entries - distance matrix
   * @param fromIndex - starting point
   * @returns {DistanceEntry}
   */
  private getTripBackToStart(entries: DistanceEntry[], fromIndex: number) {
    return entries.filter(el => el.fromIndex === fromIndex && el.toIndex === 0)[0];
  }

  private removeTripBack(entries: DistanceEntry[]) {
    return entries.filter(el => el.toIndex !== 0);
  }

  private getEntriesFrom(fromIndex: number, entries: DistanceEntry[]): DistanceEntry[] {
    return entries.filter(el => el.fromIndex === fromIndex);
  }

  private getShortestTrip(entries: DistanceEntry[]): DistanceEntry {
    return entries.reduce((prev, curr) => prev.distance < curr.distance ? prev : curr);
  }

  private getLongestTrip(entries: DistanceEntry[]): DistanceEntry {
    return entries.reduce((prev, curr) => prev.distance > curr.distance ? prev : curr);
  }

  private removeVisited(fromIndex: number, entries: DistanceEntry[]) {
    return entries.filter(el => el.fromIndex !== fromIndex && el.toIndex !== fromIndex);
  }
}
