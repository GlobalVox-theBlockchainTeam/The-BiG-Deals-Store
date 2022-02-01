import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { clusterApiUrl, Connection, PublicKey, Transaction } from '@solana/web3.js';
import { WalletService } from './wallet.service';

declare var window: any;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SolflareWalletService extends WalletService {

  public tokenBalance?: any;

  constructor(
    public http: HttpClient
  ) { super(http); }

  private async connectSolflareWallet() {
    const isSolflareInstalled = window.solflare && window.solflare.isSolflare;
    if ( isSolflareInstalled ) {
      if ("solflare" in window) {
        const provider = window.solflare;
        if (provider.isSolflare) {
          if (!provider.isConnected) {
            try {
              await window.solflare.connect();
              return window.solflare;
            } catch (err) {
                console.log('err ==> ', err);
            }
          } else {
            console.log('Already Exists Connection');
            await window.solflare.connect();
            return window.solflare;
          }    
        }
      } else {
        return false;
      }
    } else {
      console.log("Solflare wallet is not installed")
    }
  }

  async connectWallet() {
    let walletProvider = await this.connectSolflareWallet();
    this.setWalletProvider(walletProvider);
    console.log('Public Key ==> ', this.walletProvider.publicKey.toString());
    this.createToken();
  }

  async disconnectSolflareWallet() {
    await this.walletProvider.disconnect();
  }

}