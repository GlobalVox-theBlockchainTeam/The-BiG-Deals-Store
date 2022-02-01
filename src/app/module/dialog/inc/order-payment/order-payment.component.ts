import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Constants } from 'src/app/helper/constants.helper';
import { PubsubService, PubsubSubscription } from '@fsms/angular-pubsub';
import { OrderPlacedMessage } from 'src/app/pub_sub/order-placed.message';
import { CartService } from 'src/app/service/cart.service';
import { OrderPlacedInterface } from '../../../../interface/order-placed-interface';

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss']
})
export class OrderPaymentComponent implements OnInit {

  panelOpenState = false;
  isTransferToken: boolean = false;
  selectedCoin = 'TRC20';
  collpase1Address = btoa(Math.random().toString()).substr(10, 30);
  collpase2Address = btoa(Math.random().toString()).substr(10, 30);
  coinList = [
    {
      name: "ERC20",
      walleatAddress: btoa(Math.random().toString()).substr(10, 30),
    },
    {
      name: "TRC20",
      walleatAddress: btoa(Math.random().toString()).substr(10, 30),
    },
    {
      name: "KCC",
      walleatAddress: btoa(Math.random().toString()).substr(10, 30),
    },
    {
      name: "Algorand",
      walleatAddress: btoa(Math.random().toString()).substr(10, 30),
    }
  ]

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private pubsubService: PubsubService,
    private cartService: CartService,
    private dialogRef: MatDialogRef<any>
  ) { }

  @ViewChild('coinSuccessMsgDialog', { static: true }) coinSuccessMsgDialog!: TemplateRef<any>;

  ngOnInit(): void {
  }

  confirmTransferClick() {
    this.isTransferToken = true;
  }

  transferClick() {
    this.orderPlaced();
  }

  closeDialog() {
    this.dialogRef.close(this.coinSuccessMsgDialog);
  }

  orderPlaced() {
    let payload: OrderPlacedInterface = {
      paymentMethod: {
        method: "checkmo"
      },
      shippingMethod: {
        method_code: "flatrate",
        carrier_code: "flatrate",
        additionalProperties: {}
      }
    }
    this.cartService.orderPlaced(payload).subscribe(response => {
      this.pubsubService.publish(
        new OrderPlacedMessage(response)
      );
      this.dialogRef = this.dialog.open(this.coinSuccessMsgDialog, {
        width: Constants.MEDIUM_DIALOG_WIDTH
      });
    }, error => {
      console.log(error);
    })
  }


  getSelectedCoinWalleatAddress() {
    let sel = this.coinList.filter(d => d.name == this.selectedCoin);
    if (sel.length > 0) {
      return sel[0].walleatAddress
    }
    return btoa(Math.random().toString()).substr(10, 30);
  }

}
