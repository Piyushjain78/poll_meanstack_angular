import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { core_constent } from "../../core/constent";
import { SnackbarComponent } from '../../shared/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})

export class VoteService {

  API_URL: string = core_constent.API_ENDPOINT;

  constructor(private http: HttpClient, public snackbar: SnackbarComponent) { }

  // POst the vote
  postVote(POST_DATA: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.API_URL+"vote/add", POST_DATA).subscribe((data:any) => {
        resolve(data);
        this.snackbar.snackbarSucces('Vote added Successfully!');
        console.log(data);
      }, error => {
        reject(error);
        this.snackbar.snackbarError('Something Went Wrong!');
        if(error.error.message) {
          this.snackbar.snackbarError(error.error.message);
        } else {
          this.snackbar.snackbarError('Email Id Already Exist!');
        }
      });
    });
  }
}
