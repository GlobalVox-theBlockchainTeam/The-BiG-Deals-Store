import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WalletService } from './wallet.service';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class PhantomWalletService extends WalletService {

  public tokenBalance?: any;

  constructor(
    public http: HttpClient
  ) { super(http); }

  private async connectPhantomWallet() {
    const isPhantomInstalled = window.solana && window.solana.isPhantom;
    if ( isPhantomInstalled ) {
      if ("solana" in window) {
        const provider = window.solana;
        if (provider.isPhantom) {
          if (!provider.isConnected) {
            try {
              await window.solana.connect();
              return window.solana;
            } catch (err) {
                console.log('err ==> ', err);
            }
          } else {
            console.log('Already Exists Connection');
            await window.solana.connect();
            return window.solana;
          }    
        }
      } else {
        return false;
      }
    } else {
      console.log("Phantom wallet is not installed")
    }
  }

  async connectWallet() {
    let walletProvider = await this.connectPhantomWallet();
    this.setWalletProvider(walletProvider);
    console.log('Public Key ==> ', this.walletProvider.publicKey.toString());
    this.createToken();
  }

  async disconnectPhantomWallet() {
    await this.walletProvider.disconnect();
  }

}