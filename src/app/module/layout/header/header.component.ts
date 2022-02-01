import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PubsubService, PubsubSubscription } from '@fsms/angular-pubsub';
import { Constants } from 'src/app/helper/constants.helper';
import { CustomUtils } from 'src/app/helper/custom-utils.helper';
import { Msg } from 'src/app/helper/msg.helper';
import { CartItems } from 'src/app/model/cart-items.model';
import { Customer } from 'src/app/model/customer.model';
import { CustomerLoginMessage } from 'src/app/pub_sub/customer-login-message';
import { LoginMessage } from 'src/app/pub_sub/login-message';
import { CheckoutMessage } from 'src/app/pub_sub/checkout-dialog-message';
import { CartService } from 'src/app/service/cart.service';
import { CustomerAccountManagementService } from 'src/app/service/customer-account-management.service';
import { UserWalletService } from 'src/app/service/user-wallet.service';
import { AuthDialogComponent } from '../../dialog/auth-dialog/auth-dialog.component';
import { BuyPlayDialogComponent } from '../../dialog/buy-play-dialog/buy-play-dialog.component';
import { CheckoutDialogComponent } from '../../dialog/checkout-dialog/checkout-dialog.component';
import { WalletPairingDialogComponent } from '../../dialog/wallet-pairing-dialog/wallet-pairing-dialog.component';
import { PhantomWalletService } from 'src/app/service/phantom-wallet.service';
import { SolflareWalletService } from 'src/app/service/solflare-wallet.service';
import { SolletWalletService } from 'src/app/service/sollet-wallet.service';
import { WalletType } from 'src/app/enum/wallet-type.enum';
import { WalletService } from 'src/app/service/wallet.service';
import { WalletTransactionMessage } from 'src/app/pub_sub/wallet-transacrion-message';
import { BuyPlayPackageInterface } from 'src/app/interface/buy-play-package.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  logoImage: string = '../../../../assets/images/logo.png';
  walletIcons: any = {
    phantom: '../../../../assets/images/phantom_wallet_icon.png',
    solflare: '../../../../assets/images/solflare_wallet_icon.svg',
    sollet: '../../../../assets/images/sollet_wallet_icon.png',
    big: Constants.TOKEN_LOGO
  };
  showSidebar: boolean = false;
  subscriptions: PubsubSubscription[] = [];
  customer: Customer = new Customer();
  walletLoading: boolean = false;
  cartLoading: boolean = false;
  walletAddress: string = '';
  walletBalance: number = 0.0;
  playBalance: number = 0.0;
  totalCartItems: number = 0;
  cartItems: CartItems[] = [];
  walletType = WalletType;
  walletBalanceData!: any;
  dialogRef!: any;
  userWalletData: any = {
    address: '',
    wallet_type: '',
    play: 0,
    balance:0
  };
  tokenName: string = Constants.TOKEN_NAME;
  tokenLogo: string = Constants.TOKEN_LOGO;
  bidHammerIcon = Constants.BID_HAMMER_ICON;

  constructor(
    private dialog: MatDialog,
    private pubsubService: PubsubService,
    private userWalletService: UserWalletService,
    private customerService: CustomerAccountManagementService,
    private cartService: CartService,
    private phantomWalletService: PhantomWalletService,
    private solflareWalletService: SolflareWalletService,
    private solletWalletService: SolletWalletService,
    private walletService: WalletService,
    private msg: Msg
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.pubsubService.subscribe({
        messageType: LoginMessage.messageType,
        callback: (msg) => {
          this.openRegisterDialog();
        },
      })
    );
    this.subscriptions.push(
      this.pubsubService.subscribe({
        messageType: CheckoutMessage.messageType,
        callback: (msg) => {
          this.openCheckoutDialog();
        },
      })
    );
    this.subscriptions.push(
      this.pubsubService.subscribe({
        messageType: CustomerLoginMessage.messageType,
        callback: (msg) => {
            this.customer.deserialize(msg.message.payload.customer);
        },
      })
    );

    this.subscriptions.push(
      this.pubsubService.subscribe({
        messageType: WalletTransactionMessage.messageType,
        callback: async (msg: any) => {
          console.log('msg ==> ', msg);
          if (msg.message.payload.action == 'transfer') {
            await this.transferToken(msg.message.payload.amount);
          }
        },
      })
    );

    this.getCartItems();
    this.setWalletNetwork();
    if (this.isLoggedIn) {
      this.getCurrentCustomer();
    }
    // this.openBuyPlayDialog();
  }

  setWalletNetwork() {
    this.phantomWalletService.setNetworkConnection(Constants.SOL_NETWORK);
    this.phantomWalletService.setTokenWallet(Constants.TOKEN_ADDRESS);

    this.solflareWalletService.setNetworkConnection(Constants.SOL_NETWORK);
    this.solflareWalletService.setTokenWallet(Constants.TOKEN_ADDRESS);

    this.solletWalletService.setNetworkConnection(Constants.SOL_NETWORK);
    this.solletWalletService.setTokenWallet(Constants.TOKEN_ADDRESS);
  }

  get isLoggedIn(): boolean {
    return CustomUtils.isLoggedIn();
  }

  getWalletIcon(walletType: WalletType) {
      return this.walletIcons[walletType];
  }
  getWalletTitle(walletType: WalletType) {
    let title = '';
    switch (walletType) {
      case WalletType.phantom:
        title = 'Phantom Wallet';
      break;
      case WalletType.solflare:
        title = 'Solflare Wallet';
      break;
      case WalletType.sollet:
        title = 'Sollet Wallet';
      break;
    }
    return title;
  }

  getWalletDetails() {
    this.userWalletService.getUserWallet(this.customer.id)
    .subscribe(response => {
      this.userWalletData = response;
    });
  }

  async connectWallet(walletType: WalletType) {
    this.walletLoading = true;
    switch (walletType) {
      case WalletType.phantom:
        await this.phantomWalletService.connectWallet();
        this.walletAddress = this.phantomWalletService.getPublicKey().toString();
      break;
      case WalletType.solflare:
        await this.solflareWalletService.connectWallet();
        this.walletAddress = this.solflareWalletService.getPublicKey().toString();
      break;
      case WalletType.sollet:
        await this.solletWalletService.connectWallet();
        this.walletAddress = this.solletWalletService.getPublicKey().toString();
      break;
    }
    this.userWalletData.address = this.walletAddress;
    this.userWalletData.wallet_type = walletType;
    this.userWalletService.connectWallet({
      wallet_type: walletType,
      wallet_address: this.walletAddress,
      user_id: this.customer.id
    }).subscribe(response => {
      this.walletLoading = false;
    })
  }

  async transferToken(amount: any) {
    let walletService!: WalletService;
    console.log('this.userWalletData.wallet_type ==> ', this.userWalletData.wallet_type);
    let signature: string | null = 'bot';
    let walletAddress = this.userWalletData.address;
    if (this.userWalletData.wallet_type != WalletType.big) {
      switch(this.userWalletData.wallet_type) {
        case WalletType.phantom:
          walletService = this.phantomWalletService;
        break;
        case WalletType.solflare:
          walletService = this.solflareWalletService;
        break;
        case WalletType.sollet:
          walletService = this.solletWalletService;
        break;
      }
      await walletService.connectWallet();
      walletAddress = walletService.getPublicKey().toString();
      console.log('this.walletAddress ==> ', this.walletAddress);
      signature = await walletService.transferToken(amount, Constants.TOKEN_OWNER_ADDRESS);
      console.log('signature ==> ', signature);
    }
    
    let buyPlayPackageInterface: BuyPlayPackageInterface = {
      user_id: this.customer.id,
      big_tokens: amount,
      signature: signature,
      wallet_type: this.userWalletData.wallet_type,
      wallet_address: walletAddress
    };
    this.userWalletService.buyPlayPackage(buyPlayPackageInterface).subscribe(res => {
      this.msg.showMessage('Play purchased successfully');
      this.dialogRef.close();
    });
  }

  async disconnectWallet() {
    this.walletLoading = true;
    this.userWalletService.disconnectWallet(this.customer.id).subscribe(response => {
      this.walletLoading = false;
      this.walletAddress = '';
      this.walletBalanceData = undefined;
      this.userWalletData.address = '';
    })
  }

  getWalletBalance() {
    this.walletService.setNetworkConnection(Constants.SOL_NETWORK);
    this.walletService.getBalance(Constants.TOKEN_ADDRESS, this.userWalletData.address)
    .subscribe(res => {
      this.walletBalanceData = this.phantomWalletService.getBalanceValue(res);
      console.log('walletBalanceData ==> ', this.walletBalanceData);
      this.walletLoading = false;
    });
  }

  getCartItems() {
    this.cartLoading = true;
    this.cartService.getCartItems().subscribe((res: CartItems[]) => {
      this.totalCartItems = res.length;
      this.cartItems = res;
      this.cartLoading = false;
    });
  }

  getCurrentCustomer() {
    if (this.isLoggedIn) {
      this.customerService.getCustomer().subscribe((res: Customer) => {
        this.customer.deserialize(res);
        this.getWalletDetails();
      });
    }
  }

  openCheckoutDialog() {
    const dialogRef = this.dialog.open(CheckoutDialogComponent, {
      width: Constants.LARGE_DIALOG_WIDTH,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.ngOnInit();
    });

  }

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(AuthDialogComponent, {
      width: Constants.MEDIUM_DIALOG_WIDTH,
      data: {name: ""}
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.ngOnInit();
    });
  }

  openWalletPairingDialog(): void {
    const dialogRef = this.dialog.open(WalletPairingDialogComponent, {
      width: Constants.MEDIUM_DIALOG_WIDTH,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
        this.walletLoading = false;
        this.walletAddress = result.address;
        this.walletBalance = result.balance;
        this.playBalance = result.play;
    });
  }

  openBuyPlayDialog(): void {
    if (this.userWalletData.balance > 0) {
      const dialogRef = this.dialog.open(BuyPlayDialogComponent, {
        width: Constants.MEDIUM_DIALOG_WIDTH,
        data: {}
      });
      this.dialogRef = dialogRef;
      dialogRef.afterClosed().subscribe(result => {
         
      });
    } else {
      this.msg.showMessage('Insufficient '+this.tokenName+' Tokens');
    }
  }

  walletMenuOpened() {
    this.walletLoading = true;
    if(this.userWalletData) {
      this.userWalletService.getUserWallet(this.customer.id).subscribe(res => {
        this.userWalletData = res;
        this.walletLoading = false;
      });
    }
  }

  logout() {
    CustomUtils.clearLocalStorage();
  }

  closeWindow() {
    this.showSidebar = false;
  }
  openWindow() {
    this.showSidebar = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

}
