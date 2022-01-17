import { Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";

import { PollService } from "../poll.service";

@Component({
   selector : 'app-polllist',
   templateUrl: './polllist.component.html',
   styleUrls: ['./polllist.component.scss']
})

export class PolllistComponent implements OnInit {

    items : any = [];
    screenWidth: number = 0;
    paginator_obj : {'length' : number, 'pageIndex' : number, 'pageSize' : number, 'previousPageIndex' : any} = {"length" : 10, "pageIndex" : 0, "pageSize" : 10, "previousPageIndex" : 0};
    all_polls_count: number = 10; 
    loading: any = true;

    constructor(private pollService: PollService) { 
        
        // getting all the polls from DB
        pollService.getPolls(this.paginator_obj).then((result)=>{
            console.log("result");
            pollService.Poll_items = result;
            this.items = pollService.Poll_items;
            this.all_polls_count = pollService.all_polls_count;
            this.loading = false;
        });

    }

    ngOnInit(): void {
        this.screenWidth = window.innerWidth;
    }

    // will run on run time if screen size changes , dynamic
    onResize(event: any) {
        this.screenWidth = event.target.innerWidth;
    } 

    // for paginator
    public getPaginatorData(event: PageEvent): PageEvent {
        console.log(event)
        this.paginator_obj = {'length' : event.length, 'pageIndex' : event.pageIndex, 'pageSize' : event.pageSize, 'previousPageIndex' : event.previousPageIndex};
        this.pollService.getPolls(this.paginator_obj).then((result)=>{
            this.pollService.Poll_items = result;
            this.items = this.pollService.Poll_items;
        });
        return event;
    }
    
} 