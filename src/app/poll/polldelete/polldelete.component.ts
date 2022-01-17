import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { core_constent } from "src/app/core/constent";
import { PollService } from "../poll.service";

@Component({
  selector: 'app-polldelete',
  templateUrl: './polldelete.component.html'
})

export class PolldeleteComponent implements OnInit {

  button_color = core_constent.PRIMARY_COLOR;

  constructor( public pollService : PollService, public dialogRef: MatDialogRef<PolldeleteComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router ) {

  }

	deletePoll() {
		this.pollService.deletePoll(this.data.poll_id).then(result => {
      console.log(result);
      this.router.navigate(['/home']);
    }).catch( err => {
      console.log(err);
    });
		this.dialogRef.close(); 
	}

  ngOnInit() {

  }
}