import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  text: string = "";
  routePath: string;
  routeName: string;
  dialogRef: MdDialogRef;

  constructor(public dialogRef: MdDialogRef<ConfirmDialogComponent>) {
    try {
      this.dialogRef = dialogRef;
      this.text = dialogRef.config.data.text;
      this.routePath = dialogRef.config.data.routePath;
      this.routeName = dialogRef.config.data.routeName;
    } catch (e) {
      console.log("No dialog data was provided. ");
    }
  }

}
