import { Component, Input, OnChanges } from '@angular/core';
import { DistanceEntry } from '../../../../worker/distance-matrix';
import { RouteSection } from '../route-section/route-section';

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
    this.totalDistance = Math.round(this.roundTrip.reduce((first, snd) => first + snd.distance, 0) / 1000);
    this.totalConsumption = Math.round(this.roundTrip.reduce((first, snd) => first + snd.consumption, 0));
  }

  getSection(entry: DistanceEntry) {
    const from = this.destinations[entry.fromIndex];
    const to = this.destinations[entry.toIndex];
    const distance = entry.distance;
    return new RouteSection(from, to, distance, entry.elevationPercentage);
  }


}
