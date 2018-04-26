/**
 * Created by Kim on 23.02.2017.
 */

const flatMap = (xs, f) => xs.map(f).reduce((x, y) => x.concat(y), []);

export class DistanceMatrix {
  destinations: string[] = [];
  distanceEntries: DistanceEntry[] = [];
  hasRoute = false;

  constructor(matrix: any) {
    if (matrix && matrix.destinationAddresses) {
      this.destinations = matrix.destinationAddresses;
      this.distanceEntries = flatMap(matrix.rows, (r, index) => this.getRows(index, r));
      this.distanceEntries = this.distanceEntries.filter(e => e.fromIndex !== e.toIndex);
      if (this.distanceEntries.length > 0) {
        this.hasRoute = this.distanceEntries.reduce((hasRoute, el) => hasRoute && el.isReachable, true);
      }
    }
  }

  private getRows(fromIndex: number, row: any) {
    return row.elements.map((e, toIndex) => new DistanceEntry(fromIndex, toIndex, e));
  }
}

export class DistanceEntry {
  fromIndex = 0;
  toIndex = 0;
  isReachable = false;
  distance = 0;

  constructor(fromIndex: number, toIndex: number, entry: any) {
    this.fromIndex = fromIndex;
    this.toIndex = toIndex;
    this.isReachable = entry.status === 'OK';
    if (this.isReachable) {
      this.distance = entry.distance.value;
    }
  }
}
