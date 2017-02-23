import { Component, OnInit } from '@angular/core';
import {Input} from '@angular/core/src/metadata/directives';
import {RouteSection} from '../route-section';

@Component({
  selector: 'app-route-section',
  templateUrl: './route-section.component.html',
  styleUrls: ['./route-section.component.css']
})
export class RouteSectionComponent implements OnInit {

  @Input() section: RouteSection;

  constructor() { }

  ngOnInit() {
  }

}
