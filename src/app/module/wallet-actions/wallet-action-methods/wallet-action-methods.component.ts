import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { WalletType } from 'src/app/enum/wallet-type.enum';
import { Constants } from 'src/app/helper/constants.helper';
import { BuyPlayPackageInterface } from 'src/app/interface/buy-play-package.interface';
import { PhantomWalletService } from 'src/app/service/phantom-wallet.service';
import { SolflareWalletService } from 'src/app/service/solflare-wallet.service';
import { SolletWalletService } from 'src/app/service/sollet-wallet.service';
import { UserWalletService } from 'src/app/service/user-wallet.service';
import { WalletService } from 'src/app/service/wallet.service';

@Component({
  selector: 'app-wallet-action-methods',
  templateUrl: './wallet-action-methods.component.html',
  styleUrls: ['./wallet-action-methods.component.scss']
})
export class WalletActionMethodsComponent implements OnInit {

  userId:number = 0;
  userWalletData: any = {
    address: '',
    wallet_type: '',
    play: 0,
    balance:0
  };
  walletService!: WalletService;
  constructor(
    private route: ActivatedRoute,
    private phantomWalletService: PhantomWalletService,
    private solflareWalletService: SolflareWalletService,
    private solletWalletService: SolletWalletService,
    private userWalletService: UserWalletService
  ) { }

  async ngOnInit() {
    await this.route.params.subscribe( async params => {
      console.log(params);
      this.userId = params.user_id;
      const walletType = params.wallet_type;
      // this.setWalletNetwork();
      await this.connectWallet(walletType);
      switch(params.action) {
        case 'disconnect':
          this.disconnectWallet();
        break;
        case 'transfer':
          let amount = parseFloat(params.amount);
          let toWallet = Constants.TOKEN_OWNER_ADDRESS;
          await this.connectWallet(walletType);
          let signature = await this.walletService.transferToken(amount, toWallet);
          let buyPlayPackageInterface: BuyPlayPackageInterface = {
            user_id: this.userId,
            big_tokens: amount,
            signature: signature,
            wallet_type: this.userWalletData.wallet_type,
            wallet_address: this.userWalletData.address
          };
          this.userWalletService.buyPlayPackage(buyPlayPackageInterface).subscribe(res => {
            window.opener?.postMessage(this.userWalletData,"*")
            window.close();
          });
        break;
      }
    });
  }

  async setWalletNetwork() {
    await this.walletService.setNetworkConnection(Constants.SOL_NETWORK);
    await this.walletService.setTokenWallet(Constants.TOKEN_ADDRESS);    
  }

  async connectWallet(walletType: WalletType) {
    switch (walletType) {
      case WalletType.phantom:
        this.walletService = this.phantomWalletService;
        await this.setWalletNetwork();
        await this.phantomWalletService.connectWallet();
        this.userWalletData.address = this.phantomWalletService.getPublicKey().toString();
        window.opener?.postMessage(this.userWalletData,"*")
        window.close();
      break;
      case WalletType.solflare:
        this.walletService = this.solflareWalletService;
        await this.setWalletNetwork();
        await this.solflareWalletService.connectWallet();
        this.userWalletData.address = this.solflareWalletService.getPublicKey().toString();
        window.opener?.postMessage(this.userWalletData,"*")
        window.close();
      break;
      case WalletType.sollet:
        this.walletService = this.solletWalletService;
        await this.setWalletNetwork();
        await this.solletWalletService.connectWallet();
        this.userWalletData.address = this.solletWalletService.getPublicKey().toString();
        window.opener?.postMessage(this.userWalletData,"*")
        window.close();
      break;
    }
    if (this.userWalletData.address != '') {
      this.userWalletData.wallet_type = walletType;
      this.userWalletService.connectWallet({
        wallet_type: walletType,
        wallet_address: this.userWalletData.address,
        user_id: this.userId
      }).subscribe(response => {
        window.opener?.postMessage(response,"*")
        window.close();
      })
    }
  }

  disconnectWallet() {
    this.userWalletService.disconnectWallet(this.userId).subscribe(response => {
      
    })
  }

  getWalletDetails() {
    this.userWalletService.getUserWallet(this.userId)
    .subscribe(response => {
      this.userWalletData = response;
    });
  }

}
