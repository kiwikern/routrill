import { DistanceEntry } from './distance-matrix';

onmessage = function (e) {
  const service = new MstRouteService();
  postMessage(service.getRoundTrip(e.data.distanceMatrix));
};

class MstRouteService {

  /**
   * Calculates a round trip using an MST and an Euler circle
   * @param entries - distance matrix
   * @returns {DistanceEntry[]}
   */
  getRoundTrip(entries: DistanceEntry[]): DistanceEntry[] {
    const mst: DistanceEntry[] = this.getMST(entries);
    const euler: DistanceEntry[] = this.getEulerCircle(mst);
    return this.getTrip(euler, entries);
  }

  /**
   * Given a distance matrix, builds up a minimum spanning tree, such that all nodes are connected with a
   * minimum total distance.
   * @param entries - distance matrix
   * @returns {DistanceEntry[]}
   */
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

  /**
   * Given an MST, calculates a possible Euler circle.
   * @param mst
   * @param from - starting point (used internally for recursion)
   * @returns {DistanceEntry[]}
   */
  private getEulerCircle(mst: DistanceEntry[], from = 0): DistanceEntry[] {
    let eulerGraph: DistanceEntry[] = [];
    for (const to of this.getDirectlyReachableNodes(mst, from)) {
      if (!this.isBridge(mst, from, to) || this.hasOnlyBridges(mst, from)) {
        const edge = this.getEdge(mst, from, to);
        if (typeof edge !== 'undefined') {
          eulerGraph.push(edge);
        }
        mst = this.removeEdge(mst, from, to);
        eulerGraph = eulerGraph.concat(this.getEulerCircle(mst, to));
        eulerGraph.forEach(e => mst = this.removeEdge(mst, e.fromIndex, e.toIndex));
      }
    }
    return eulerGraph;
  }

  /**
   * Given an Euler circle and the full distance matrix, returns an approximation for the shortest round trip.
   * @param euler - euler circle
   * @param fullGraph - distance matrix
   * @returns {DistanceEntry[]}
   */
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

  /**
   * Given a graph and a starting point, returns true, if all adjacent nodes for the starting point in the graph
   * are bridges, hence removing them would make another point unreachable.
   * @param graph
   * @param from - starting point
   * @returns {boolean}
   */
  private hasOnlyBridges(graph: DistanceEntry[], from): boolean {
    let hasBridge = true;
    for (const to of this.getDirectlyReachableNodes(graph, from)) {
      hasBridge = hasBridge && this.isBridge(graph, from, to);
    }
    return hasBridge;
  }

  /**
   * Returns true, if the edge (from -> to) is a bridge.
   * @see #hasOnlyBridges
   * @param graph
   * @param from
   * @param to
   * @returns {boolean}
   */
  private isBridge(graph: DistanceEntry[], from: number, to: number): boolean {
    const countWithEdge: number = this.countReachable(graph, from);
    if (countWithEdge === 1) {
      return true;
    }
    const countWithoutEdge: number = this.countReachable(this.removeEdge(graph, from, to), from);
    return countWithEdge > countWithoutEdge;
  }

  /**
   * Returns the edges with the shortest distance (both ways)
   * @param entries
   * @returns {DistanceEntry[]}
   */
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

  private removeVisited(entriesToVisit: DistanceEntry[], visited: DistanceEntry[]): DistanceEntry[] {
    return entriesToVisit.filter(e => visited.indexOf(e) === -1);
  }

  private removeEdge(graph: DistanceEntry[], from: number, to: number) {
    return graph.filter(e => e.fromIndex !== from || e.toIndex !== to);
  }

  /**
   * Returns true, if there is a cycle from the starting point in the graph.
   * @param graph
   * @param start starting point
   * @param parent - used internally for recursion
   * @param visited - used internally for recursion
   * @returns {boolean}
   */
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

  /**
   * Returns number of nodes, that can be transitively reached from the starting point.
   * @param graph
   * @param from - starting point
   * @param visited - used internally for recursion
   * @returns {number}
   */
  private countReachable(graph: DistanceEntry[], from: number, visited: number[] = []) {
    let count = 1;
    visited.push(from);
    for (const node of this.getDirectlyReachableNodes(graph, from)) {
      if (visited.indexOf(node) === -1) {
        count += this.countReachable(graph, node, visited);
      }
    }
    return count;
  }

  private getDirectlyReachableNodes(graph: DistanceEntry[], node: number) {
    return graph.filter(e => e.fromIndex === node).map(e => e.toIndex);
  }
}
