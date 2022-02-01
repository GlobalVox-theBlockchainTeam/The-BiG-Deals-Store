import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { clusterApiUrl, Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Constants } from '../helper/constants.helper';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  networkApi: string = '';
  connection!: Connection;
  myToken?: Token;
  walletProvider!: any;
  tokenWallet: string = '';

  constructor(
    public http: HttpClient
  ) { }

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
    this.connection = new Connection(
      clusterApiUrl(network),
      'confirmed'
    );
  }

  async connectWallet() {
    
  }

  setTokenWallet(tokenWallet: string) {
    this.tokenWallet = tokenWallet;
  }

  getTokenWallet() {
    return this.tokenWallet;
  }

  setWalletProvider(walletProvider: any) {
    this.walletProvider = walletProvider;
  }

  getWalletProvider() {
    return this.walletProvider;
  }

  setMyToken(myToken: Token) {
    this.myToken = myToken;
  }

  getMyToken() {
    return this.myToken;
  }

  createToken() {
    let walletProvider = this.getWalletProvider();
    const tokenMint = new PublicKey(this.getTokenWallet());
    let myToken = new Token(
      this.connection,
      tokenMint,
      TOKEN_PROGRAM_ID,
      walletProvider.publicKey
    );
    this.setMyToken(myToken);
    return myToken;
  }

  private getTokenBalance(wallet_address: any, token_mint: any) {
    return this.http.post(this.networkApi, [{
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenAccountsByOwner",
      params: [ wallet_address,
            {
              mint: token_mint,
            },
            {
              encoding: "jsonParsed",
            },
          ],
    }], httpOptions);
  }

  getPublicKey() {
    let walletProvider = this.getWalletProvider();
    return walletProvider.publicKey;
  }

  getBalance(tokenWallet: string, wallet: string) {
    const tokenMint = new PublicKey(tokenWallet).toString();
    return this.getTokenBalance(wallet, tokenMint);
  }

  getBalanceValue(res: any) {
    if(res[0]?.result?.value.length > 0) {
      return res[0]?.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount;
    } else {
      return 0;
    }
  }

  async getCustomTokenAddress(destPublicKey: any) {
    let myToken: any = this.createToken();
    return await Token.getAssociatedTokenAddress(
      myToken!.associatedProgramId,
      myToken!.programId,
      myToken!.publicKey,
      destPublicKey
    );  
  }

  async signCustomTransaction(transaction: Transaction) {
    let walletProvider = this.getWalletProvider();
    let fromWallet = new PublicKey(walletProvider.publicKey);
    transaction.recentBlockhash = (await this.connection.getRecentBlockhash()).blockhash;
    transaction.feePayer = fromWallet;
    let signed = await walletProvider.signTransaction(transaction);
    let signature = await this.connection.sendRawTransaction(signed.serialize());
    await this.connection.confirmTransaction(signature);
    console.log("Signature: ", signature);
    return signature;
  }

  async getReceiverTokenAccount(receiverPublicKey: any) {
    let myToken: any = this.createToken();
    let walletProvider = this.getWalletProvider();
    try {
      let associatedDestinationTokenAddr = await this.getCustomTokenAddress(receiverPublicKey);
      let receiverAccount = await this.connection.getAccountInfo(associatedDestinationTokenAddr);
      console.log('receiverAccount ==> ', receiverAccount);
      if (receiverAccount == null) {
        let from_wallet = new PublicKey(walletProvider.publicKey);
        
        const transaction = new Transaction().add(
          Token.createAssociatedTokenAccountInstruction(
            myToken!.associatedProgramId,
            myToken!.programId,
            myToken!.publicKey,
            associatedDestinationTokenAddr,
            receiverPublicKey,
            from_wallet
          )
        );
        await this.signCustomTransaction(transaction);
        receiverAccount = await this.connection.getAccountInfo(associatedDestinationTokenAddr);
        console.log('receiverAccount ==> ', receiverAccount);
        // associatedDestinationTokenAddr = await this.getCustomTokenAddress(destPublicKey);
        // console.log('associatedDestinationTokenAddr ==> ', associatedDestinationTokenAddr);
        return await myToken!.getOrCreateAssociatedAccountInfo(receiverPublicKey);
      } else {
        return await myToken!.getOrCreateAssociatedAccountInfo(receiverPublicKey);
      }
    } catch (err) {
      console.log('Error ==> ', err);
      return null;
    }
  }

  async transferToken(tokenAmount: number, toWalletAddress: string) {
    let to_wallet = new PublicKey(toWalletAddress);
    let walletProvider = this.getWalletProvider();
    console.log('to_wallet ==> ', to_wallet.toString());
    let receiverAccount = await this.getReceiverTokenAccount(to_wallet);
    let senderAccount = await this.getReceiverTokenAccount(walletProvider.publicKey);
    if(receiverAccount !== null && senderAccount !== null) {
      try {
          let transaction = new Transaction()
          .add(Token.createTransferInstruction(
              TOKEN_PROGRAM_ID,
              senderAccount.address,
              receiverAccount.address,
              walletProvider.publicKey,
              [],
              tokenAmount * Constants.LAMPORTS_PER_TOKEN
          ));
          return await this.signCustomTransaction(transaction);
      } catch(err) {
        console.log('Transaction Error ==> ', err);
      }
    }
    return null;
  }

}
