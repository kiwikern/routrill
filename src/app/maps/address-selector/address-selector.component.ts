import { Component, OnInit } from '@angular/core';
import {AddressService} from '../address.service';

@Component({
  selector: 'app-address-selector',
  templateUrl: './address-selector.component.html',
  styleUrls: ['./address-selector.component.css']
})
export class AddressSelectorComponent implements OnInit {

  constructor(private service: AddressService) {

  }

  ngOnInit() {
  }

}
