import {Component, OnInit} from '@angular/core';
import {Input} from '@angular/core/src/metadata/directives';

@Component({
  selector: 'app-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.css']
})
export class RouteMapComponent implements OnInit {
  @Input() destinations: string[] = [];
  //noinspection TypeScriptUnresolvedVariable
  private directionsService = new google.maps.DirectionsService;
  //noinspection TypeScriptUnresolvedVariable
  private directionsDisplay = new google.maps.DirectionsRenderer;
  private start: string = "";
  private end: string = "";
  private waypoints: string[] = [];


  constructor() {
    if (this.destinations.length > 2) {
      this.start = this.destinations[0];
      this.end = this.destinations.slice(-1)[0];
      this.waypoints = this.destinations.slice(1, -1);
    }
  }

  ngOnInit() {
    console.dir(document.getElementById('map'));
    //noinspection TypeScriptUnresolvedVariable
    let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {lat: 41.85, lng: -87.65}
  });
    this.directionsDisplay.setMap(map);
  }

  calculateAndDisplayRoute() {
    let waypts: any[] = this.waypoints.map(wp => ({location: wp, stopover: 'true'}));

    //noinspection TypeScriptUnresolvedVariable
    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
      //noinspection TypeScriptUnresolvedVariable
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

}
