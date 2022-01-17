import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PollcreateComponent } from './poll/pollcreate/pollcreate.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { PollviewComponent } from './poll/pollview/pollview.component';

const routes: Routes = [  
  {
    path : "home",
    component : HomeComponent
  },
  {
    path : "create",
    component : PollcreateComponent
  },
  {
    path : "signup",
    component : SignupComponent
  },
  {
    path : "login",
    component : LoginComponent
  },
  {
    path : "view",
    component : PollviewComponent
  },
  {
    path : "**",
    redirectTo : "home"
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
