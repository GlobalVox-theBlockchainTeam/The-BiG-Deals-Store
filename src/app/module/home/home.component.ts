import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomUtils } from 'src/app/helper/custom-utils.helper';
import { ProductService } from 'src/app/service/product.service';
import { CartService } from 'src/app/service/cart.service';
import { CountdownConfig, CountdownEvent, CountdownComponent, CountdownStatus } from 'ngx-countdown';
import { Msg } from 'src/app/helper/msg.helper';
import { SocketService } from 'src/app/service/socket.service';
import { CustomerAccountManagementService } from 'src/app/service/customer-account-management.service';
import { PubsubService, PubsubSubscription } from '@fsms/angular-pubsub';
import { LoginMessage } from 'src/app/pub_sub/login-message';
import { ProductDetails, ProductLink } from 'src/app/model/product-details.model';
import { Customer } from 'src/app/model/customer.model';
import { CustomerLoginMessage } from 'src/app/pub_sub/customer-login-message';
import { CustomAttribute } from 'src/app/model/custom-attribute.model';
import { MatDialog } from '@angular/material/dialog';
import { BidSuccessDialogComponent } from './bid-success-dialog/bid-success-dialog.component';
import { Constants } from 'src/app/helper/constants.helper';
import { CartItemInterface } from '../../interface/cart-item.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  productImage: any;
  product: ProductDetails = new ProductDetails();
  currentBidPrice: number = 0;
  totalBids: number = 0;
  config: CountdownConfig = { leftTime: 20, notify: 0 };
  bidButtonDisabled: boolean = true;
  lastBidder: string = '';
  bidProduct: ProductLink = new ProductLink;
  isLoading: boolean = true;
  subscriptions: PubsubSubscription[] = [];
  customer: Customer = new Customer();
  timeLeftInSec = 0;
  productSKU = 'product-1';
  auctionRemainingTime: number = 0;
  playValue: number = 0;
  cartQuote: string = '';
  currentFinalPriceText = '';

  @ViewChild(CountdownComponent, {static: false}) countdownTimer!: CountdownComponent;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private customerService: CustomerAccountManagementService,
    private msg: Msg,
    private socketService: SocketService,
    private pubsubService: PubsubService,
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.pubsubService.subscribe({
        messageType: CustomerLoginMessage.messageType,
        callback: (msg) => {
            this.customer.deserialize(msg.message.payload.customer);
        },
      })
    );

    this.productService.getProductDetailsById(this.productSKU).subscribe( (response: ProductDetails) => {
      this.product.deserialize(response);
      this.productImage = this.product.getBaseImage();
      console.log('this.product ==>', this.product);
      this.handleSocketMessage();
      this.product.getBidProduct().then(res => {this.bidProduct = res});
      this.product.getAttribute('play_value').then((attribute: CustomAttribute) => {
        this.playValue = Number(attribute.value);
      });
      this.getCurrentFinalPriceText();
      this.isLoading = false;
    });
    this.getCartQuote();
  }

  handleSocketMessage() {
    this.socketService
        .getAuctionRemainingTime(this.product.id)
        .subscribe(msg => {
          console.log('msg ==> ', msg);
          let timeLeft = msg.timeLeft;
          if (timeLeft <= 0) {
            this.auctionRemainingTime = timeLeft;
          }
        });

    this.socketService
        .getMessage(this.product.id)
        .subscribe(msg => {
          console.log('Incoming msg', msg);
          this.lastBidder = msg.lastBidder;
        });
    
    this.socketService
        .getCountdown(this.product.id)
        .subscribe(msg => {
          console.log('Counter', msg.timeLeft);
          this.timeLeftInSec = msg.timeLeft;
          this.totalBids = msg.totalBids;
          if (msg.lastBidderId !== this.customer.id) {
            this.bidButtonDisabled = false;
          }
        });
    
    this.socketService
        .getBidClose(this.product.id)
        .subscribe(msg => {
          const winner = msg.winner;
          if(winner.customerId === this.customer.id) {
              this.addProductToCart();
          } else {
            this.openBidSuccessDialog('loose');
          }
        });
    
    this.socketService
        .getBidStatus()
        .subscribe(msg => {
          if(msg.status === 'success') {
            this.msg.showMessage('Bid placed successfully');
          } else {
            this.msg.showMessage('Bid failed');
          }
        });
  }

  handleCountdownEvent(e: CountdownEvent) {
    if (e.status === CountdownStatus.done) {
      this.bidButtonDisabled = true;
    }
  }

  placeBid() {
    this.bidButtonDisabled = true;
    const socketMessage = {
      customerId: this.customer.id,
      customerName: this.customer.getName(),
      customerEmail: this.customer.email,
      productId: this.product.id
    };
    this.socketService.sendMessage(JSON.stringify(socketMessage));
  }

  login() {
    this.pubsubService.publish(
      new LoginMessage({
        from: 'Home page'
      })
    );
  }

  getCartQuote() {
    this.cartService.getCartQuote().subscribe(res => {
      this.cartQuote = res.toString();
    }, error => {
      console.log(error);
    })
  }

  addProductToCart(): void {
    let payload: CartItemInterface = {
      cartItem: {
        sku: this.product.sku,
        qty: 1,
        quote_id: this.cartQuote,
        product_option: {
          extension_attributes: this.getBundleOption()
        }
      }
    }
    this.cartService.addToCart(payload).subscribe(response => {
      this.openBidSuccessDialog('won');
    }, error => {
      console.log(error);
    })
  }

  getBundleOption() {
    let options: any = [];
    this.product.extension_attributes.bundle_product_options.map(element => {
      let option = {
        option_id: element.option_id,
        option_qty: this.totalBids,
        option_selections: this.getOptionsSelecation(element.product_links)
      }
      options.push(option);
    })
    return { 'bundle_options': options };
  }

  getOptionsSelecation(product_links: any[]) {
    let optionsSelections: any = [];
    product_links.map((element) => {
      optionsSelections.push(parseInt(element.id))
    })
    return optionsSelections;
  }

  openBidSuccessDialog(bidResult: 'won' | 'loose'): void {
    const dialogRef = this.dialog.open(BidSuccessDialogComponent, {
      width: Constants.MEDIUM_DIALOG_WIDTH,
      data: {
        customer: this.customer,
        bidResult: bidResult
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.ngOnInit();
    });
  }

  get isLoggedIn(): boolean {
    return this.customerService.isLoggedIn();
  }

  get currentBidPriceText() {
    return CustomUtils.priceFormat((this.bidProduct.price * this.totalBids));
  }

  getCurrentFinalPriceText() {
    this.product.getPrice.then((attr: CustomAttribute) => {
        this.currentFinalPriceText = CustomUtils.priceFormat(Number(attr.value));
    });
  }

  get auctionRemainingTimeFormatted() {
    return CustomUtils.secondToHourMinSec((this.auctionRemainingTime * -1));
  }

  get bidRemainingTimeFormatted() {
    return CustomUtils.secondToHourMinSec(this.timeLeftInSec);
  }

  get auctionStarted() {
    return this.auctionRemainingTime >= 0;
  }

  get isAuctionAvailable() {
    return this.auctionRemainingTime >= 0 && this.timeLeftInSec > 0;
  }

}
