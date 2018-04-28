import { Component, Input, OnChanges } from '@angular/core';
import { DistanceEntry } from '../../../../worker/distance-matrix';

/**
 * Show a computed route as:
 * 1. Map
 * 2. Totals (distance/consumption)
 * 3. Table with route details
 */
@Component({
  selector: 'tsp-route-result',
  templateUrl: './route-result.component.html',
  styleUrls: ['./route-result.component.css']
})
export class RouteResultComponent implements OnChanges {

  @Input() roundTrip: DistanceEntry[];
  @Input() destinations;
  totalDistance = 0;
  totalConsumption = 0;
  stopsInOrder = [];

  constructor() {
  }

  ngOnChanges() {
    this.stopsInOrder = this.roundTrip.map(t => this.destinations[t.fromIndex]);
    this.totalDistance = Math.round(this.sumUp('distance') / 1000);
    this.totalConsumption = Math.round(this.sumUp('consumption'));
  }

  private sumUp(attributeName: string): number {
    return this.roundTrip.reduce((first, snd) => first + snd[attributeName], 0);
  }

}
