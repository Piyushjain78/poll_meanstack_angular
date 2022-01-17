import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;
  loginModel:any;
  confirm:any;
  errorflag:boolean=false;
  change:boolean=false;
  email:any;
  emailError:boolean=false;

  constructor(private authService: AuthService) { 
    this.loginModel={
      firstName:"",
      lastName:"",
      email:"",
      password:"",
      confirm_password:""
    };
  }

  doLogin() {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(this.loginModel.email && re.test(this.loginModel.email)){
      this.errorflag = false;
      // CREATE USER ACCOUNT
      if(this.loginModel.email && this.loginModel.password) {
        this.authService.Login(this.loginModel);
      }
    } else {
      this.errorflag = true;
    }
  }

  ngOnInit(): void {
  }

  checkEmail() {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(this.loginModel.email)) {
      this.errorflag = false;
    } else {
      this.errorflag = true;
    }
  }
}
