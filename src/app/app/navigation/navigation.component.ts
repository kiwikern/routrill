import {Component, Input, EventEmitter} from '@angular/core';
import {Output} from '@angular/core/src/metadata/directives';

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
