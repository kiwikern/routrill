import {Injectable} from '@angular/core';
import {DistanceEntry} from '../distance-matrix';

@Injectable()
export class MstRouteService {
  getRoundTrip(entries: DistanceEntry[]): DistanceEntry[] {
    let mst: DistanceEntry[] = this.getMST(entries);
    let euler: DistanceEntry[] = this.getEulerCircle(mst);
    let roundTrip: DistanceEntry[] = this.getTrip(euler, entries);
    return roundTrip;
  }

  private getMST(entries: DistanceEntry[]): DistanceEntry[] {
    let mst: DistanceEntry[] = [];
    let entriesToVisit = entries.slice(0);
    while (entriesToVisit.length > 0) {
      let shortest: DistanceEntry[] = this.getShortestEdges(entriesToVisit);
      if (!this.formsCycle(mst.concat(shortest), shortest[0].fromIndex)) {
        mst = mst.concat(shortest);
      }
      entriesToVisit = this.removeVisited(entriesToVisit, shortest);
    }
    return mst;
  }

  private getEulerCircle(graph: DistanceEntry[], from: number = 0): DistanceEntry[] {
    let eulerGraph: DistanceEntry[] = [];
    for (let to of this.getReachableNodes(graph, from)) {
      if (this.isBridge(graph, from, to) || this.hasNoBridges(graph, from))  {
        let edge = this.getEdge(graph, from, to);
        if (typeof edge != 'undefined') {
          eulerGraph.push(edge);
        }
        graph = this.removeEdge(graph, from, to);
        eulerGraph = eulerGraph.concat(this.getEulerCircle(graph, to));
        eulerGraph.forEach(e => graph = this.removeEdge(graph, e.fromIndex, e.toIndex));
      }
    }
    return eulerGraph;
  }

  private getTrip(euler: DistanceEntry[], fullGraph: DistanceEntry[]): DistanceEntry[] {
    let trip: DistanceEntry[] = [];
    let visited: number[] = [];
    let lastTo: number = 0;
    for (let node of euler) {
      if (visited.indexOf(node.toIndex) == -1) {
        trip.push(this.getEdge(fullGraph, lastTo, node.toIndex));
        lastTo = node.toIndex;
        visited.push(node.fromIndex);
      }
    }
    trip.push(this.getEdge(fullGraph, lastTo, 0));
    return trip;
  }

  private getEdge(graph: DistanceEntry[], from:number, to:number) : DistanceEntry {
    return graph.filter(e => e.fromIndex == from && e.toIndex == to)[0];
  }

  private hasNoBridges(graph: DistanceEntry[], from): boolean {
    let hasBridge: boolean = false;
    for (let to of this.getReachableNodes(graph, from)) {
      hasBridge = hasBridge || this.isBridge(graph, from, to);
    }
    return !hasBridge;
  }

  private isBridge(graph: DistanceEntry[], from: number, to: number): boolean {
    let countWithEdge: number = this.countReachable(graph, from);
    if (countWithEdge == 1) {
      return true;
    }
    let countWithoutEdge: number = this.countReachable(this.removeEdge(graph, from, to), from);
    if (countWithEdge > countWithoutEdge) {
      return false;
    }
    return true;
  }

  private getShortestEdges(entries: DistanceEntry[]): DistanceEntry[] {
    let shortest: DistanceEntry = entries.reduce((prev, curr) => {
      if (prev.distance < curr.distance) {
        return prev;
      } else {
        return curr;
      }
    });
    let back: DistanceEntry = entries.filter(e => e.fromIndex == shortest.toIndex && e.toIndex == shortest.fromIndex)[0];
    return [shortest, back];
  }

  private removeVisited(entriesToVisit: DistanceEntry[], shortest: DistanceEntry[]): DistanceEntry[] {
    return entriesToVisit.filter(e => shortest.indexOf(e) == -1);
  }

  private removeEdge(graph: DistanceEntry[], from: number, to: number) {
    return graph.filter(e => e.fromIndex != from || e.toIndex != to);
  }

  private formsCycle(graph: DistanceEntry[], start: number, parent: number = start, visited: number[] = []): boolean {
    let nodes: number[] = this.getNodes(graph);
    visited.push(start);
    for (let vertex of nodes) {
      if (vertex == parent) {
        continue;
      } else if (!this.isReachable(graph, start, vertex)) {
        continue;
      } else if (visited.indexOf(vertex) != -1 || this.formsCycle(graph, vertex, start, visited)) {
        return true;
      } else {
      }
    }
    return false;
  }

  private getNodes(graph: DistanceEntry[]): number[] {
    return graph.map(e => e.fromIndex)
      .filter((v, i, a)=>a.indexOf(v) == i);
  }

  private isReachable(graph: DistanceEntry[], from: number, to: number): boolean {
    return graph.reduce((isReachable, e) => isReachable || (e.fromIndex == from && e.toIndex == to), false);
  }

  private countReachable(graph: DistanceEntry[], from: number, visited: number[] = []) {
    let count = 1;
    visited.push(from);
    for (let node of this.getReachableNodes(graph, from)) {
      if (visited.indexOf(node) == -1) {
        count += this.countReachable(graph, node, visited);
      }
    }
    return count;
  }

  private getReachableNodes(graph: DistanceEntry[], node: number) {
    return graph.filter(e => e.fromIndex == node).map(e => e.toIndex);
  }
}
