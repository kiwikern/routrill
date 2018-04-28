import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

/**
 * Display a map that shows a selected route (@Input destinations).
 */
@Component({
  selector: 'tsp-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.css']
})
export class RouteMapComponent implements OnInit, OnChanges {
  @Input() destinations: string[] = [];
  private directionsService = new google.maps.DirectionsService;
  private directionsDisplay = new google.maps.DirectionsRenderer;


  constructor(private snackBar: MatSnackBar) {
  }

  ngOnChanges() {
    if (this.destinations.length > 0) {
      this.calculateAndDisplayRoute();
    }
  }

  /**
   * Initialize Google Maps.
   */
  ngOnInit() {
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 6,
      center: {lat: 41.85, lng: -87.65}
    });
    this.directionsDisplay.setMap(map);
  }

  /**
   * Show a roundtrip between the destinations.
   */
  calculateAndDisplayRoute() {
    let start = '';
    let end = '';
    let waypoints = [];
    if (this.destinations.length >= 2) {
      start = this.destinations[0];
      end = this.destinations[0];
      waypoints = this.destinations.slice(1);
    } else {
      this.showSnackbar('You need at least two destinations.');
      return;
    }
    const waypts: any[] = waypoints.map(wp => ({location: wp, stopover: true}));

    this.directionsService.route({
      origin: start,
      destination: end,
      waypoints: waypts,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        this.showSnackbar('Directions request failed. Try again.');
        console.error('Maps API call failed due to ', status);
      }
    });
  }

  showSnackbar(message: string) {
    const config: any = {duration: 3000};
    this.snackBar.open(message, '', config);
  }

}
