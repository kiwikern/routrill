import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Input} from '@angular/core/src/metadata/directives';
import {MdSnackBar} from '@angular/material';

@Component({
  selector: 'tsp-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.css']
})
export class RouteMapComponent implements OnInit, OnChanges {
  @Input() destinations: string[] = [];
  //noinspection TypeScriptUnresolvedVariable
  private directionsService = new google.maps.DirectionsService;
  //noinspection TypeScriptUnresolvedVariable
  private directionsDisplay = new google.maps.DirectionsRenderer;


  constructor(private snackBar: MdSnackBar) {
  }

  ngOnChanges() {
    if (this.destinations.length > 0) {
      this.calculateAndDisplayRoute();
    }
  }

  ngOnInit() {
    //noinspection TypeScriptUnresolvedVariable
    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 6,
      center: {lat: 41.85, lng: -87.65}
    });
    this.directionsDisplay.setMap(map);
  }

  calculateAndDisplayRoute() {
    let start = "";
    let end = "";
    let waypoints = [];
    if (this.destinations.length >= 2) {
      start = this.destinations[0];
      end = this.destinations[0];
      waypoints = this.destinations.slice(1);
    } else {
      this.showSnackbar("You need at least two destinations.");
      return;
    }
    let waypts: any[] = waypoints.map(wp => ({location: wp, stopover: true}));

    //noinspection TypeScriptUnresolvedVariable
    this.directionsService.route({
      origin: start,
      destination: end,
      waypoints: waypts,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
      //noinspection TypeScriptUnresolvedVariable
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        this.showSnackbar("Directions request failed. Try again.");
        console.log("Maps API call failed due to " + status);
      }
    });
  }

  showSnackbar(message: string) {
    let config: any = {duration: 3000};
    this.snackBar.open(message, '', config);
  }

}
