import { Component, Inject, Input, OnChanges, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { GOOGLE } from '../../maps.module';

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
  private directionsService;
  private directionsDisplay;
  private Map;
  private readonly TRAVEL_MODE_CAR;
  private readonly DIRECTION_STATUS_OK;


  constructor(private snackBar: MatSnackBar,
              @Inject(GOOGLE) google) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.Map = google.maps.Map;
    this.TRAVEL_MODE_CAR = google.maps.TravelMode.DRIVING;
    this.DIRECTION_STATUS_OK = google.maps.DirectionsStatus.OK;
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
    const map = new this.Map(document.getElementById('map'), {
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
      travelMode: this.TRAVEL_MODE_CAR
    }, (response, status) => {
      if (status === this.DIRECTION_STATUS_OK) {
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
