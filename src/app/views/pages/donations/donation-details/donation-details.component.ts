import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { Donations } from '../../../../core/auth/_models/Donations.model';
@Component({
  selector: 'kt-donation-details',
  templateUrl: './donation-details.component.html',
  styleUrls: ['./donation-details.component.scss']
})
export class DonationDetailsComponent implements OnInit {
 donations
  constructor(
    public dialogRef: MatDialogRef<DonationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    console.log(this.data.user_id)
    console.log(this.data.Donations)
    this.donations=this.data.Donations
  }

}
