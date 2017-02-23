/**
 * Created by Kim on 23.02.2017.
 */

const flatMap = (xs, f) => xs.map(f).reduce((x, y) => x.concat(y), []);

export class DistanceMatrix {
  destinations: string[] = [];
  distanceRows: DistanceEntry[] = [];

  constructor(matrix: any) {
    this.destinations = matrix.destinationAddresses;
    this.distanceRows = flatMap(matrix.rows, (r, index) => this.getRows(index, r));
  }

  private getRows(fromIndex: number, row: any) {
    return row.elements.map((e, toIndex) => new DistanceEntry(fromIndex, toIndex, e));
  }
}

// export class DistanceRow {
//   fromIndex: number = 0;
//   distanceEntries: DistanceEntry[] = [];
//
//   constructor(fromIndex: number, row: any) {
//     this.fromIndex = fromIndex;
//     this.distanceEntries = row.elements.map((e, toIndex) => new DistanceEntry(this.fromIndex, toIndex, e));
//   }
// }

export class DistanceEntry {
  fromIndex: number = 0;
  toIndex: number = 0;
  isReachable: boolean = false;
  distance: number = 0;

  constructor(fromIndex: number, toIndex: number, entry: any) {
    this.fromIndex = fromIndex;
    this.toIndex = toIndex;
    this.isReachable = entry.status == 'OK';
    if (this.isReachable) {
      this.distance = entry.distance.value;
    }
  }
}
