/**
 * Created by Kim on 23.02.2017.
 */
/**
 * A RouteSection has a start, a destination and a distance.
 */
export class RouteSection {
  from = '';
  to = '';
  distance = 0;
  elevationPercentage = 0;

  constructor(from: string, to: string, distance: number, elevationPercentage: number) {
    this.from = from;
    this.to = to;
    this.distance = Math.round(distance / 1000);
    this.elevationPercentage = elevationPercentage;
  }
}
