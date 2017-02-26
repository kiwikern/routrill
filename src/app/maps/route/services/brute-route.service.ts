import {Injectable} from '@angular/core';
import {DistanceEntry} from '../../distance-matrix';

@Injectable()
export class BruteRouteService {

  getRoundTrip(graph: DistanceEntry[]): DistanceEntry[] {
    let nodes: number[] = this.getNodes(graph);
    let permutations: number[][] = this.getPermutations(nodes.slice(1))
      .map(p => ([0]).concat(p.concat([0])));
    let results = [];
    for (let permutation of permutations) {
      let trip = this.getTrip(graph, permutation);
      let distance = this.getDistance(trip);
      results.push({permutation: permutation, distance: distance});
    }
    let min = results.reduce((min, result) => min.distance < result.distance ? min : result);
    return this.getTrip(graph, min.permutation);
  }

  private getTrip(graph: DistanceEntry[], nodes: number[]) {
    let trip: DistanceEntry[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      let entry: DistanceEntry = this.getEdge(graph, nodes[i], nodes[i + 1]);
      if (typeof entry == 'undefined') {
        console.log(nodes);
        console.log("Current index i: " + i);
      } else {
        trip.push(entry);
      }
    }
    return trip;
  }

  private getPermutations(nodes: number[], currentPermutation: number[] = []): number[][] {
    let permutations = [];
    if (nodes.length == 0) {
      permutations.push(currentPermutation);
    } else {
      for (let i = 0; i < nodes.length; i++) {
        let current = nodes.slice();
        let next = current.splice(i, 1);
        permutations = permutations.concat(this.getPermutations(current.slice(), currentPermutation.concat(next)));
      }
    }
    return permutations;
  }

  private getEdge(graph: DistanceEntry[], from: number, to: number): DistanceEntry {
    return graph.filter(e => e.fromIndex == from && e.toIndex == to)[0];
  }

  private getDistance(trip: DistanceEntry[]) {
    return trip.reduce((distance, entry) => distance + entry.distance, 0);
  }

  private getNodes(graph: DistanceEntry[]): number[] {
    return graph.map(e => e.fromIndex)
      .filter((v, i, a)=>a.indexOf(v) == i);
  }
}
