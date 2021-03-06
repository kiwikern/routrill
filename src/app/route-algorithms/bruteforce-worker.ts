import { DistanceEntry } from './distance-matrix';

onmessage = function (e) {
  const service = new BruteRouteService();
  postMessage(service.getRoundTrip(e.data.distanceMatrix));
};

class BruteRouteService {

  /**
   * Given a distance matrix, returns the shortest roundtrip starting at the first entry's starting location.
   * @param graph
   * @returns {DistanceEntry[]}
   */
  getRoundTrip(graph: DistanceEntry[]): DistanceEntry[] {
    const nodes: number[] = this.getNodes(graph);
    const waypointPermutations: number[][] = this.getPermutations(nodes.slice(0));
    const allRoundTrips: number[][] = waypointPermutations.map(p => ([0]).concat(p.concat([0])));
    const results = [];
    for (const permutation of allRoundTrips) {
      const trip = this.getTrip(graph, permutation);
      const consumption = this.getTotalConsumption(trip);
      results.push({permutation: permutation, consumption});
    }
    const minimum = results.reduce((min, result) => min.consumption < result.consumption ? min : result);
    return this.getTrip(graph, minimum.permutation);
  }

  /**
   * Given a number of nodes in a certain order, returns the corresponding roundtrip.
   * @param graph distance matrix of all nodes
   * @param nodes locations to visit in right order
   * @returns {DistanceEntry[]}
   */
  private getTrip(graph: DistanceEntry[], nodes: number[]) {
    const trip: DistanceEntry[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const entry: DistanceEntry = this.getEdge(graph, nodes[i], nodes[i + 1]);
      if (typeof entry !== 'undefined') {
        trip.push(entry);
      }
    }
    return trip;
  }

  /**
   * Given a list of locations, returns all possible waypoint orders as a list of locations.
   * @param nodes - all locations except start/end point
   * @param currentPermutation
   * @returns {Array}
   */
  private getPermutations(nodes: number[], currentPermutation: number[] = []): number[][] {
    let permutations = [];
    if (nodes.length === 0) {
      permutations.push(currentPermutation);
    } else {
      for (let i = 0; i < nodes.length; i++) {
        const current = nodes.slice();
        const next = current.splice(i, 1);
        permutations = permutations.concat(this.getPermutations(current.slice(), currentPermutation.concat(next)));
      }
    }
    return permutations;
  }

  /**
   * Given a distance matrix, returns the corresponding DistanceEntry for a start and a destination.
   * @param graph - distance matrix
   * @param from
   * @param to
   * @returns {DistanceEntry}
   */
  private getEdge(graph: DistanceEntry[], from: number, to: number): DistanceEntry {
    return graph.filter(e => e.fromIndex === from && e.toIndex === to)[0];
  }

  /**
   * Given a list of DistanceEntries, returns the total consumption.
   * @param trip
   * @returns {number}
   */
  private getTotalConsumption(trip: DistanceEntry[]) {
    return trip.reduce((consumption, entry) => consumption + entry.consumption, 0);
  }

  /**
   * Returns all locations (as indices) for a given distance matrix.
   * @param graph - distance matrix
   * @returns {number[]}
   */
  private getNodes(graph: DistanceEntry[]): number[] {
    return graph.map(e => e.fromIndex)
      .filter((v, i, a) => a.indexOf(v) === i);
  }
}
