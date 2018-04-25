import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'tsp-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  text = '';
  title = '';
  routePath: string;
  routeName: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    try {
      this.text = data.text;
      this.title = data.title;
      this.routePath = data.routePath;
      this.routeName = data.routeName;
    } catch (e) {
      console.log('No dialog data was provided. ');
    }
  }

}
