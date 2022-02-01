import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PubsubService, PubsubSubscription } from '@fsms/angular-pubsub';
import { CheckoutMessage } from 'src/app/pub_sub/checkout-dialog-message';
import { Customer } from 'src/app/model/customer.model';

@Component({
  selector: 'app-bid-success-dialog',
  templateUrl: './bid-success-dialog.component.html',
  styleUrls: ['./bid-success-dialog.component.scss']
})
export class BidSuccessDialogComponent implements OnInit {

  customer:Customer = new Customer;
  bidResult!: 'won' | 'loose';

  constructor(
    private dialogRef: MatDialogRef<BidSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private pubsubService: PubsubService,
  ) { 
    this.customer.deserialize(data.customer);
    this.bidResult = data.bidResult;
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close({success: true})
  }

  openCheckoutDialog() { 
    this.pubsubService.publish(
      new CheckoutMessage('open checkout form')
    );
  }
}
