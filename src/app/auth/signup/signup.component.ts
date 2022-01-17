import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  hide = true;
  signupModel:any;
  confirm:any;
  errorflag:boolean=false;
  checkValue:boolean=false;
  change:boolean=false;
  email:any;
  emailError:boolean=false;

  constructor(private authService: AuthService) { 
    this.signupModel={
      firstName:"",
      lastName:"",
      email:"",
      password:"",
      confirm_password:""
    };
  }

  doSignup() {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(this.signupModel.email && re.test(this.signupModel.email)) {
      this.errorflag = false;
      // CREATE USER ACCOUNT
      if(this.signupModel.firstName && this.signupModel.lastName && this.signupModel.email && this.signupModel.password && this.signupModel.confirm_password) {
        this.authService.Signup(this.signupModel);
      }
    } else {
      this.errorflag = true;
    }
  }

  checkEmail() {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(this.signupModel.email)){
      this.errorflag = false;
    } else {
      this.errorflag = true;
    }
  }

  ngOnInit(): void {
  }

}