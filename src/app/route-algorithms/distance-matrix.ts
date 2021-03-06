/**
 * Created by Kim on 23.02.2017.
 */
import { Place } from './place.interface';

const flatMap = (xs, f) => xs.map(f).reduce((x, y) => x.concat(y), []);

export class DistanceMatrix {
  destinations: Place[] = [];
  distanceEntries: DistanceEntry[] = [];
  hasRoute = false;

  constructor(matrix: any, destinations: Place[]) {
    this.destinations = destinations;
    if (matrix) {
      this.distanceEntries = flatMap(matrix.rows, (r, index) => this.getRows(index, r));
      this.distanceEntries = this.distanceEntries.filter(e => e.fromIndex !== e.toIndex);
      if (this.distanceEntries.length > 0) {
        this.hasRoute = this.distanceEntries.reduce((hasRoute, el) => hasRoute && el.isReachable, true);
      }
    }
  }

  private getRows(fromIndex: number, row: any) {
    return row.elements.map((e, toIndex) => new DistanceEntry(fromIndex, toIndex, e, this.getElevationDiff(fromIndex, toIndex)));
  }

  getElevationDiff(fromIndex: number, toIndex: number): number {
    const fromElevation = this.destinations[fromIndex].elevation;
    const toElevation = this.destinations[toIndex].elevation;
    return toElevation - fromElevation;
  }
}

export class DistanceEntry {
  fromIndex = 0;
  toIndex = 0;
  isReachable = false;
  distance = 0;
  /**consumption in kw/h*/
  consumption = 0;
  elevationPercentage = 0;

  constructor(fromIndex: number, toIndex: number, entry: any, elevationDiff: number) {
    this.fromIndex = fromIndex;
    this.toIndex = toIndex;
    this.isReachable = entry.status === 'OK';
    if (this.isReachable) {
      this.distance = entry.distance.value;
    }
    if (this.distance > 0) {
      this.elevationPercentage = elevationDiff / (this.distance / (100 * 100));
      this.consumption = this.getConsumption();
    }
  }

  /**
   * Depending on the elevation, the distance weight can be increased or decreased.
   * @param {DistanceEntry} entry
   * @returns {number}
   */
  private getConsumption(): number {
    const consumption = this.distance / 1000; // 100kw/h per 100km
    if (this.elevationPercentage >= 3) {
      return 1.2 * consumption;
    } else if (this.elevationPercentage <= -3) {
      return 0.9 * consumption;
    } else {
      return consumption;
    }
  }
}
