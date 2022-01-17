import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { core_constent } from "../core/constent";
import { SnackbarComponent } from '../shared/snackbar/snackbar.component';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class PollService {

  API_URL: string = core_constent.API_ENDPOINT;
  POST_DATA : any;
  Poll_items : any = [];
  all_polls_count: number = 0;
  subject = new Subject();

  constructor(private http: HttpClient, public snackbar: SnackbarComponent, private authService: AuthService) {}

  // GET ALL POLL DATA
  // paginator_obj: PageEvent 
  getPolls(body: PageEvent) {
    console.log(body);
    return new Promise((resolve, reject) => {
      this.http.get(this.API_URL+"poll"+"?filter="+encodeURI(JSON.stringify(body))).subscribe((data:any) => {
        this.Poll_items = data.response;
        this.all_polls_count = data.all_polls_count;
        console.log(this.Poll_items)
        resolve(data.response);
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

  // get a single poll by its id
  getPollItem(poll_id: any) {
    return new Promise((resolve, reject) => {
      this.http.get(this.API_URL+"poll/getItem/"+poll_id).subscribe((data: any) => {
        resolve(data.response);
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

  // POst the poll
  postPolls(POST_DATA: any) {
    this.authService.getJwtDecodedToken().then((res:any) => {
      // attaching the user_id
      POST_DATA.user_id = res.user_id;
      POST_DATA.userName = res.firstName+" "+res.lastName;
      return new Promise((resolve, reject) => {
        this.http.post(this.API_URL+"poll/create", POST_DATA).subscribe((data:any) => {
          resolve(data.response);
          console.log(data.response);
          this.Poll_items.push(data.response);
          this.snackbar.snackbarSucces('Poll Created Successfully!');
        }, error => {
          reject(error);
          if(error.error.message)
            this.snackbar.snackbarSucces(error.error.message);
          else
            this.snackbar.snackbarSucces('Something Went Wrong!');
        });
      });
    })
    .catch((e) => { 
      console.log(e);
      this.snackbar.snackbarSucces('You are not Authorized to do it!');
    }); 
  }

  // Delete a Poll
  deletePoll(poll_id: any) {
    return new Promise((resolve, reject) => {
      this.http.delete(this.API_URL+"poll/delete/"+poll_id).subscribe((data:any) => {
        console.log("success");
        resolve(data.response);

        // remove the deleted item from the array
        let index = this.Poll_items.map(function(item: { _id: any; }) {
          return item._id
        }).indexOf(poll_id);
        this.Poll_items.splice(index, 1);

        this.snackbar.snackbarSucces('Poll Deleted Successfully!');
      }, error => {
        console.log("error");
        reject(error);
        if(error.error.message) {
          this.snackbar.snackbarError(error.error.message);
        } else {
          this.snackbar.snackbarError('Email Id Already Exist!');
        }
      });
    });
  }

  // edit a poll
  editPoll(pollObj: any) {
    return new Promise((resolve, reject) => {
      this.http.patch(this.API_URL+"poll/update/"+pollObj._id, pollObj).subscribe((data: any) => {
        resolve(data.response);
        // adding to subject
        this.subject.next(data.response);
        console.log(this.Poll_items);
        // end
        this.snackbar.snackbarSucces('Poll Updated Successfully!');
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

  // getting only updated edit poll item
  getCurrentPollItemData():any {
    return this.subject.asObservable();
  }
   
}
