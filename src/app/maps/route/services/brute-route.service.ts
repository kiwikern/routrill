import {Injectable} from '@angular/core';
import {DistanceEntry} from './distance-matrix';

@Injectable()
export class BruteRouteService {

  getRoundTrip(graph: DistanceEntry[]): DistanceEntry[] {
    const nodes: number[] = this.getNodes(graph);
    const permutations: number[][] = this.getPermutations(nodes.slice(1))
      .map(p => ([0]).concat(p.concat([0])));
    const results = [];
    for (const permutation of permutations) {
      const trip = this.getTrip(graph, permutation);
      const distance = this.getDistance(trip);
      results.push({permutation: permutation, distance: distance});
    }
    const minimum = results.reduce((min, result) => min.distance < result.distance ? min : result);
    return this.getTrip(graph, minimum.permutation);
  }

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

  private getEdge(graph: DistanceEntry[], from: number, to: number): DistanceEntry {
    return graph.filter(e => e.fromIndex === from && e.toIndex === to)[0];
  }

  private getDistance(trip: DistanceEntry[]) {
    return trip.reduce((distance, entry) => distance + entry.distance, 0);
  }

  private getNodes(graph: DistanceEntry[]): number[] {
    return graph.map(e => e.fromIndex)
      .filter((v, i, a) => a.indexOf(v) === i);
  }
}
