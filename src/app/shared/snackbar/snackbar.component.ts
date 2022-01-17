import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar'

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {

 
  constructor(public snackBar: MatSnackBar) {}

  private configSucces: MatSnackBarConfig = {
    panelClass: ['style-succes'], 
    duration : 5000   
  };

  private configError: MatSnackBarConfig = {
    panelClass: ['style-error'],
    duration : 5000
  };

  public snackbarSucces(message :any) {
    this.snackBar.open(message, 'close', this.configSucces);
  }

  public snackbarError(message: any) {
    this.snackBar.open(message, 'close', this.configError);
  }

  ngOnInit() {
  }


}