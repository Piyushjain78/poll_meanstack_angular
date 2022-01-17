import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { core_constent } from "../core/constent";
import { SnackbarComponent } from '../shared/snackbar/snackbar.component';
import { Router } from '@angular/router';
import { Subject } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private API_URL: string = core_constent.API_ENDPOINT;
  private authToken: any = "";
  private jwtDecodedToken: any = "";
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, public snackbar: SnackbarComponent, private router : Router) { }

  // getting user token
  getToken() {
    this.authToken = localStorage.getItem("user_session");
    return this.authToken;
  }
  
  // get decoded jwt token
  getJwtDecodedToken() {
    return new Promise((resolve, reject) => {
      try{
        this.getToken();
        if(this.authToken) {
          this.jwtDecodedToken = JSON.parse(atob(this.authToken.split('.')[1]));
        }
        resolve(this.jwtDecodedToken);
        // return this.jwtDecodedToken;
      } 
      catch(err) {
        reject(err);
        // return this.jwtDecodedToken;
      }
    });
  }

  getAuthStatusListener() {
    console.log("autlistnerstatus:"+this.authStatusListener);
    return this.authStatusListener.asObservable();
  }

  // Signup
  Signup(POST_DATA: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.API_URL+"account/signup", POST_DATA).subscribe((data:any) => {
        resolve(data);
        if(data.response) {
          localStorage.setItem("user_session", data.response.token);
          // user auth status published observer set 
          this.authStatusListener.next(true);
        }
        this.router.navigate(['/home']);
        this.snackbar.snackbarSucces(data.message);
      }, error => {
        reject(error);
        if(error.error.message) {
          this.snackbar.snackbarError(error.error.message);
        } else {
          this.snackbar.snackbarError('Email Id Already Exist!');
        }
      });
    });
  }

  // Login
  Login(POST_DATA: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.API_URL+"account/login", POST_DATA).subscribe((data:any) => {
        resolve(data);
        if(data.response) {
          localStorage.setItem("user_session", data.response.token);
          // user auth status published observer set 
          this.authStatusListener.next(true);
        }
        this.router.navigate(['/home']);
        this.snackbar.snackbarSucces(data.message);
      }, error => {
        reject(error);
        if(error.error.message) {
          this.snackbar.snackbarError(error.error.message);
        } else {
          this.snackbar.snackbarError('Email Id Already Exist!');
        }
      });
    });
  }

  // logout
  doLogout() {
    try {
      // removing user session
      localStorage.removeItem("user_session"); 
      // user auth status published observer set 
      this.authStatusListener.next(false);
      this.router.navigate(['/login']);
      this.snackbar.snackbarSucces("You have been Logged Out Successfully");
    } catch(err) {
      this.snackbar.snackbarSucces("Something Went Wrong! Please try again later.");
    }
  }

}
