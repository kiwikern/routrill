import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'tsp-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  @Input() layout: string;
  @Output() pageChosen: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

}
