import { Component, Inject, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { core_constent } from "src/app/core/constent";
import { PollService } from '../poll.service';

@Component({
  selector: 'app-pollcreate',
  templateUrl: './pollcreate.component.html',
  styleUrls: ['./pollcreate.component.scss']
})
export class PollcreateComponent implements OnInit {

  // data time picker work
  @ViewChild('picker') picker: any;
  @ViewChild('endpicker') endpicker: any;
  public startdate_disabled = false;
  public enddate_disabled = false;
  public showSpinners = true;
  public showSeconds = true;
  public touchUi = false;
  public enableMeridian = true;
  public minDate: any;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  // End data time picker work

  pollModel : any;
  hideOptions : any = {
    option3_id : true,
    option4_id : true,
    option5_id : true
  };
  count :any = 2;

  ERROR_404_GIF = core_constent.ERROR_404_GIF;  
  isEditable: boolean = false;
  isEditableError: boolean = false;

  constructor(public pollService: PollService, public dialogRef: MatDialogRef<PollcreateComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
   
    // data time picker work
    this.minDate = new Date();
    // End data time picker work

    this.pollModel = {
      question:"",
      userName: "Piyush Jain",
      user_id: "",
      start:"",
      expiry:"",
      options:{
        option_1:'',
        option_2:'',
        option_3:'',
        option_4:'',
        option_5:'',
      },
      optionsResult:{
        option_1:'',
        option_2:'',
        option_3:'',
        option_4:'',
        option_5:'',
      }
    };
  }  

  ngOnInit(): void {
    // for poll edit work
    if(this.data && this.data.poll_id && this.data.pollEdit) {
      this.isEditable = true;
      this.startdate_disabled = true;
      this.pollService.getPollItem(this.data.poll_id).then( data => {
        this.isEditableError = false;
        this.pollModel = data;

        // if option 3 is already available, so need to show them on edit form too
        if(this.pollModel.options.option_3) {
          this.hideOptions.option3_id = false;
          this.count = 3;
        }
        // if option 4 is already available, so need to show them on edit form too
        if(this.pollModel.options.option_4) {
          this.hideOptions.option4_id = false;
          this.count = 4;
        }
        // if option 5 is already available, so need to show them on edit form too
        if(this.pollModel.options.option_5) {
          this.hideOptions.option5_id = false;
          this.count = 5;
        }

        // end date should be editable when enddate is greater than current date only otherwise it should be disabled in edit form
        if((new Date(this.pollModel.expiry).getTime()) <= (new Date().getTime())) {
          this.enddate_disabled = true;
        }
        
      }, (error)=> {
        this.isEditableError = true;
      });
    }
    // end
  }

  addPoll() {
    // SET VALUE OF POST POLL
    if(this.pollModel.start && this.pollModel.expiry && this.pollModel.question && this.pollModel.userName && this.pollModel.options.option_1 && this.pollModel.options.option_2){
      this.pollService.postPolls(this.pollModel);
      this.dialogRef.close();  
    }
  }

  editPoll(pollObj: any) {
    // removing start date from edit form if any
    delete pollObj.start;
    // end date should be editable when enddate is greater than current date only otherwise it should be disabled in edit form
    if(this.enddate_disabled) {
      delete pollObj.expiry;
    }
    this.pollService.editPoll(pollObj);
    this.dialogRef.close();  
  }

  showOptions() {
    if(this.count >= 2 && this.count <= 4) {
      this.count +=1;
      // more than 2 options are already avaialable, only useful in Edit form
      if(!this.hideOptions["option"+this.count+"_id"])
        this.count +=1;
      //end 
      this.hideOptions["option"+this.count+"_id"] = false;
    } 
  }

  removeOptions(id:any) {
    this.hideOptions[id] = true;
    this.count--;
  }

  ngAfterViewInit() {
    console.log('Values on ngAfterViewInit():');
    console.log("picker:", this.picker);
  }

}
