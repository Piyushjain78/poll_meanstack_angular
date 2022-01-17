import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { VoteService } from 'src/app/services/vote/vote.service';
import { core_constent } from '../../core/constent';
import { PollService } from '../poll.service';
import { PollcreateComponent } from '../pollcreate/pollcreate.component';
import { PolldeleteComponent } from '../polldelete/polldelete.component';

@Component({
  selector: 'app-pollview',
  templateUrl: './pollview.component.html',
  styleUrls: ['./pollview.component.scss']
})

export class PollviewComponent implements OnInit {

  poll_id:any = '';
  arr: any = [];
  item: any = [];
  item_options: any = [];
  errorMessage: boolean = false;
  ERROR_404_GIF = core_constent.ERROR_404_GIF;
  postVoteData: { user_id: string; poll_id: any; option: any; } | undefined;
  progress_bar_colors = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger'];
  progress_bar_text_colors = ['text-primary', 'text-success', 'text-info', 'text-warning', 'text-danger'];
  id = [0, 1, 2, 3, 4];
  poll_option_id: string = '';
  userData: any = {firstName: '', lastName: ''};
  userLoggedIn: Subscription = new Subscription;
  isUserAuthenticated: any = false;
  isUserAuthorized: any = false;

  constructor(private route: ActivatedRoute, private pollService: PollService, public voteService: VoteService, public dialog:MatDialog, private authService: AuthService) { 
    // if token is present then user is authenticated else not
    this.isUserAuthenticated = this.authService.getToken();

    // getting a particluar poll data
    //  checking if logged in user is authorized to have delete and edit button in particular poll 
    this.pollService.getPollItem(this.route.snapshot.queryParamMap.get('id')).then((result) => {
      this.item = JSON.parse(JSON.stringify(result));
      this.authService.getJwtDecodedToken().then((decoded_token: any) => {
        if(this.item && decoded_token.user_id == this.item.user_id) {
          this.isUserAuthorized = true;
        }
      });
    });
  }

  // unsubscribe the subscription when component destroyes
  ngOnDestroy() {
    this.userLoggedIn.unsubscribe();  
  }

  ngOnInit(): void {
    console.log("edit ngoninit")
    this.poll_id = this.route.snapshot.queryParamMap.get('id');
    // if someone is not authorised or id is not given on url
    if(!this.poll_id) {
      this.errorMessage = true;
    }

    // getting a particluar poll data
    this.pollService.getPollItem(this.poll_id).then((result) => {
      
      if(!result) {
        this.errorMessage = true;
        return;
      }

      this.item = JSON.parse(JSON.stringify(result));
      // converting the item option in to array so ngfor can work on it
      this.item_options = Object.entries(this.item.options).map(([type, value]) => ({type, value}));
      console.log(this.item_options)
    });

    // checking if user is logged in or not
    this.userLoggedIn = this.authService.getAuthStatusListener().subscribe(
      (user_logged_in: any) => {
        this.isUserAuthenticated = user_logged_in;
        console.log(user_logged_in);
      }
    );   

    // gettig logged in user data
    this.getUserData();

    // CALLING SUBJECT FROM THE POLL SERVICE FOR EDIT POLL DATA
    this.pollService.getCurrentPollItemData().subscribe(
      (value: any) => {
        console.log(value);
        // this.item = value[0];
        // this.item_options = Object.entries(value[0]['options']).map(([type, value]) => ({type, value}));

        this.item = value;
        this.item_options = Object.entries(value['options']).map(([type, value]) => ({type, value}));
      }
    );
  }

  // posting a vote for an particular poll
  postVote(poll_id: any, option: any) {
    console.log(option)
    console.log(poll_id);
    if(poll_id && option) {

      this.poll_option_id = poll_id+''+(option-1);
      console.log(this.poll_option_id);

      this.postVoteData = {
        user_id : "",
        poll_id : poll_id,
        option : option
      };
      let voteResponse = this.voteService.postVote(this.postVoteData);
      // Hand to hand show the +1 increment in the vote 
      voteResponse.then((res:any)=>{
        let option = "option_"+res.response.option;
        if(res.success) {
          this.item.optionsResult[option] = this.item.optionsResult[option] + 1;
          this.item.optionsResultTotal = this.item.optionsResultTotal + 1;         
        }
      }).catch((err) => {
        console.log(err);
      });

    }
  }

  // opens a poll delete dialog
  deletePollDialog(poll_id: any) {
    this.dialog.open(PolldeleteComponent, {
      height: '130px',
      width: '380px',
      data: {
        poll_id: poll_id
      }
    });
  }

  // open a poll edit dialog
  editPollDialog(poll_id: any) {
    let dialogRef = this.dialog.open(PollcreateComponent, {
      height: '650px',
      width: '500px',
      data: {
        poll_id: poll_id,
        pollEdit: true 
      }
    });
    dialogRef.afterClosed().subscribe(async result => {
      console.log(`Dialog edit result: ${result}`);
    });
  }

  // gets thelogged in user data
  getUserData() {
    this.authService.getJwtDecodedToken().then((res:any)=>{
      this.userData = res;
    });
  }

}
