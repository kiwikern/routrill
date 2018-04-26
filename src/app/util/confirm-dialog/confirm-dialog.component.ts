import { Component, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';

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

  constructor(private matDialog: MatDialog,
              private ngZone: NgZone,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    try {
      this.text = data.text;
      this.title = data.title;
      this.routePath = data.routePath;
      this.routeName = data.routeName;
    } catch (e) {
      console.error('No dialog data was provided. ');
    }
  }

  close() {
    this.ngZone.run(() => this.matDialog.closeAll());
  }

}
