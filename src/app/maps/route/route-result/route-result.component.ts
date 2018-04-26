import { Component, Input, OnInit } from '@angular/core';
import { DistanceEntry } from '../../../../worker/distance-matrix';
import { RouteSection } from '../route-section/route-section';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'tsp-route-result',
  templateUrl: './route-result.component.html',
  styleUrls: ['./route-result.component.css']
})
export class RouteResultComponent implements OnInit {

  @Input() roundTrip: Observable<any>;
  @Input() destinations;
  totalDistance = 0;
  stopsInOrder = [];

  constructor() {
  }

  ngOnInit() {
    this.roundTrip.subscribe(roundTrip => {
      console.log(roundTrip);
      this.stopsInOrder = roundTrip.map(t => this.destinations[t.fromIndex]);
      this.totalDistance = Math.round(roundTrip.reduce((first, snd) => first + snd.distance, 0) / 1000);
    });
  }

  getSection(entry: DistanceEntry) {
    const from = this.destinations[entry.fromIndex];
    const to = this.destinations[entry.toIndex];
    const distance = entry.distance;
    return new RouteSection(from, to, distance);
  }

}
