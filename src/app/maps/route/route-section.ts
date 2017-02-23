/**
 * Created by Kim on 23.02.2017.
 */
export class RouteSection {
  from: string = "";
  to: string = "";
  distance: number = 0;

  constructor(from:string, to:string, distance: number) {
    this.from = from;
    this.to = to;
    this.distance = distance;
  }
}
