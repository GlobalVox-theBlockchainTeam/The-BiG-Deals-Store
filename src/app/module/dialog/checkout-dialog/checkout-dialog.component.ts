import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { PubsubService, PubsubSubscription } from '@fsms/angular-pubsub';
import { OrderPlacedMessage } from 'src/app/pub_sub/order-placed.message';

@Component({
  selector: 'app-checkout-dialog',
  templateUrl: './checkout-dialog.component.html',
  styleUrls: ['./checkout-dialog.component.scss']
})
export class CheckoutDialogComponent implements OnInit {

  orderId = '';
  subscriptions: PubsubSubscription[] = [];
  @ViewChild('stepper', { static: true })
  private checkoutStepper!: MatStepper;

  constructor(
    private pubsubService: PubsubService,
    private dialogRef: MatDialogRef<CheckoutDialogComponent>
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.pubsubService.subscribe({
        messageType: OrderPlacedMessage.messageType,
        callback: (msg) => {
          this.orderId = msg.message.payload;
          this.checkoutStepper.next();
        },
      })
    );
  }

  addressSaved($event: any) {
    this.checkoutStepper.next();
  }

  closeDialog(): void {
    this.dialogRef.close();
  } 

}
