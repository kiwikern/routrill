import {Injectable} from '@angular/core';
import {DistanceEntry} from './distance-matrix';

@Injectable()
export class MstRouteService {
  getRoundTrip(entries: DistanceEntry[]): DistanceEntry[] {
    const mst: DistanceEntry[] = this.getMST(entries);
    const euler: DistanceEntry[] = this.getEulerCircle(mst);
    return this.getTrip(euler, entries);
  }

  private getMST(entries: DistanceEntry[]): DistanceEntry[] {
    let mst: DistanceEntry[] = [];
    let entriesToVisit = entries.slice(0);
    while (entriesToVisit.length > 0) {
      const shortest: DistanceEntry[] = this.getShortestEdges(entriesToVisit);
      if (!this.formsCycle(mst.concat(shortest), shortest[0].fromIndex)) {
        mst = mst.concat(shortest);
      }
      entriesToVisit = this.removeVisited(entriesToVisit, shortest);
    }
    return mst;
  }

  private getEulerCircle(graph: DistanceEntry[], from = 0): DistanceEntry[] {
    let eulerGraph: DistanceEntry[] = [];
    for (const to of this.getReachableNodes(graph, from)) {
      if (this.isBridge(graph, from, to) || this.hasNoBridges(graph, from)) {
        const edge = this.getEdge(graph, from, to);
        if (typeof edge !== 'undefined') {
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
    const trip: DistanceEntry[] = [];
    const visited: number[] = [];
    let lastTo = 0;
    for (const node of euler) {
      if (visited.indexOf(node.toIndex) === -1) {
        trip.push(this.getEdge(fullGraph, lastTo, node.toIndex));
        lastTo = node.toIndex;
        visited.push(node.fromIndex);
      }
    }
    const edge = this.getEdge(fullGraph, lastTo, 0);
    if (typeof edge !== 'undefined') {
      trip.push(edge);
    }
    return trip;
  }

  private getEdge(graph: DistanceEntry[], from: number, to: number): DistanceEntry {
    return graph.filter(e => e.fromIndex === from && e.toIndex === to)[0];
  }

  private hasNoBridges(graph: DistanceEntry[], from): boolean {
    let hasBridge = false;
    for (const to of this.getReachableNodes(graph, from)) {
      hasBridge = hasBridge || this.isBridge(graph, from, to);
    }
    return !hasBridge;
  }

  private isBridge(graph: DistanceEntry[], from: number, to: number): boolean {
    const countWithEdge: number = this.countReachable(graph, from);
    if (countWithEdge === 1) {
      return true;
    }
    const countWithoutEdge: number = this.countReachable(this.removeEdge(graph, from, to), from);
    return countWithEdge <= countWithoutEdge;
  }

  private getShortestEdges(entries: DistanceEntry[]): DistanceEntry[] {
    const shortest: DistanceEntry = entries.reduce((prev, curr) => {
      if (prev.distance < curr.distance) {
        return prev;
      } else {
        return curr;
      }
    });
    const back: DistanceEntry = entries.filter(e => e.fromIndex === shortest.toIndex && e.toIndex === shortest.fromIndex)[0];
    return [shortest, back];
  }

  private removeVisited(entriesToVisit: DistanceEntry[], shortest: DistanceEntry[]): DistanceEntry[] {
    return entriesToVisit.filter(e => shortest.indexOf(e) === -1);
  }

  private removeEdge(graph: DistanceEntry[], from: number, to: number) {
    return graph.filter(e => e.fromIndex !== from || e.toIndex !== to);
  }

  private formsCycle(graph: DistanceEntry[], start: number, parent = start, visited: number[] = []): boolean {
    const nodes: number[] = this.getNodes(graph);
    visited.push(start);
    for (const vertex of nodes) {
      if (vertex === parent) {
        // continue
      } else if (!this.isReachable(graph, start, vertex)) {
        // continue
      } else if (visited.indexOf(vertex) !== -1 || this.formsCycle(graph, vertex, start, visited)) {
        return true;
      }
    }
    return false;
  }

  private getNodes(graph: DistanceEntry[]): number[] {
    return graph.map(e => e.fromIndex)
      .filter((v, i, a) => a.indexOf(v) === i);
  }

  private isReachable(graph: DistanceEntry[], from: number, to: number): boolean {
    return graph.reduce((isReachable, e) => isReachable || (e.fromIndex === from && e.toIndex === to), false);
  }

  private countReachable(graph: DistanceEntry[], from: number, visited: number[] = []) {
    let count = 1;
    visited.push(from);
    for (const node of this.getReachableNodes(graph, from)) {
      if (visited.indexOf(node) === -1) {
        count += this.countReachable(graph, node, visited);
      }
    }
    return count;
  }

  private getReachableNodes(graph: DistanceEntry[], node: number) {
    return graph.filter(e => e.fromIndex === node).map(e => e.toIndex);
  }
}
