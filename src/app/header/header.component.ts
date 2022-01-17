import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

import { core_constent } from '../core/constent';
import { PollcreateComponent } from '../poll/pollcreate/pollcreate.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy{
    
  button_color = core_constent.PRIMARY_COLOR;
  url = ['/home', '/login', '/signup', '/logout'];
  userLoggedIn: Subscription = new Subscription;
  isUserAuthenticated: any = false;

  constructor(public dialog:MatDialog, private authService: AuthService) { 
    // if token is present then user is authenticated else not
    this.isUserAuthenticated = this.authService.getToken();
  }

  // unsubscribe the subscription when component destroyes
  ngOnDestroy() {
    this.userLoggedIn.unsubscribe();  
  }

  ngOnInit() {
    this.userLoggedIn = this.authService.getAuthStatusListener().subscribe(
      (user_logged_in: any) => {
        this.isUserAuthenticated = user_logged_in;
      }
    );  
  }

  add() {
    let dialogRef = this.dialog.open(PollcreateComponent, {
      height: '650px',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    this.closed();
  }

  doLogout() {
    this.authService.doLogout();
    this.closed();
  }

  hideLogout() {
    // this.authService.isLoggedIn();
  }

  closed() {
    let id:any = document.getElementById("mynav");
    id.style.width = "0px";
  }
  
  opened() {
    let id:any = document.getElementById("mynav");
    id.style.width = "80%";
  }

}