import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PollService } from '../poll/poll.service';
import { MatDialog } from '@angular/material/dialog';
import { VoteService } from '../services/vote/vote.service';

import { PolldeleteComponent } from '../poll/polldelete/polldelete.component';
import { PollcreateComponent } from '../poll/pollcreate/pollcreate.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  items : any = [];
  postVoteData : any;
  show_progress_bar : any = [];
  show_progress_bar_flag : boolean = false;
  screenWidth: number = 0;
  // paginator_obj : {'length' : number, 'pageIndex' : number, 'pageSize' : number, 'previousPageIndex' : any} = {'length' : 100, 'pageIndex' : 0, 'pageSize' : 10, 'previousPageIndex' : 0};

  constructor(private http: HttpClient, private pollService: PollService, public dialog:MatDialog, public voteService: VoteService) { 
    // pollService.getPolls(this.paginator_obj).then((result)=>{

    //   console.log(result);
    //   pollService.Poll_items = result;
    //   this.items = pollService.Poll_items;

    //   console.log(this.items);
    // });
    console.log("cons");
  }

  // posting a vote for an particular poll
  postVote(poll_id: any, option: any) {
    if(poll_id && option) {
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
          // show progress bar
          this.show_progress_bar.push(poll_id);
          this.show_progress_bar_flag = true;
          // updating the item array
          this.items.forEach((item: any)=>{
            if(item._id == res.response.pollId) {
              item.optionsResult[option] = item.optionsResult[option] + 1;
              item.optionsResultTotal = item.optionsResultTotal + 1;
              return;
            }
          });          
        }
      });

    }
  }

  // opens a poll delete dialog
  deletePollDialog(poll_id: any) {
    let dialogRef = this.dialog.open(PolldeleteComponent, {
      height: '130px',
      width: '380px',
      data: {
        poll_id: poll_id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    console.log("ini");
  }

  // will run on run time if screen size changes , dynamic
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }

}
