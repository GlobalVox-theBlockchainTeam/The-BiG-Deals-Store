import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import Wallet from '@project-serum/sol-wallet-adapter';
import { clusterApiUrl, Connection, PublicKey, Transaction } from '@solana/web3.js';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root'
})
export class SolletWalletService extends WalletService {

  providerUrl = 'https://www.sollet.io';
  publicKey!: PublicKey;

  walletProvider!: Wallet;
  connection!: Connection;
  myToken!: Token;
  networkApi: string = '';
  tokenWallet: string = '';
  public tokenBalance?: any;

  constructor(
    public http: HttpClient
  ) { super(http); }

  setNetworkConnection(network: 'devnet'|'testnet'|'mainnet-beta') {
    switch (network) {
      case 'devnet':
        this.networkApi = 'https://api.devnet.solana.com';
      break;
      
      case 'testnet':
        this.networkApi = 'https://api.testnet.solana.com';
      break;

      case 'mainnet-beta':
        this.networkApi = 'https://api.mainnet-beta.solana.com';
      break;
    }

    let walletProvider = new Wallet(this.providerUrl, clusterApiUrl(network));
    this.setWalletProvider(walletProvider);

    this.connection = new Connection(
      clusterApiUrl(network),
      'confirmed'
    );
  }

  async connectWallet() {
    await this.walletProvider.connect();
    console.log('Public Key ==> ', this.walletProvider.publicKey?.toString());
    this.createToken();
  }

  async disconnectSolletWallet() {
    await this.walletProvider.disconnect();
  }
}