import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PubsubService } from '@fsms/angular-pubsub';
import { Constants } from 'src/app/helper/constants.helper';
import { CustomUtils } from 'src/app/helper/custom-utils.helper';
import { BuyPlayPackageInterface } from 'src/app/interface/buy-play-package.interface';
import { Customer } from 'src/app/model/customer.model';
import { WalletTransactionMessage } from 'src/app/pub_sub/wallet-transacrion-message';
import { UserWalletService } from 'src/app/service/user-wallet.service';

@Component({
  selector: 'app-buy-play-dialog',
  templateUrl: './buy-play-dialog.component.html',
  styleUrls: ['./buy-play-dialog.component.scss']
})
export class BuyPlayDialogComponent implements OnInit {

  playPackages: any = [];
  isLoading = true;
  buyButtonDisabled: boolean = false;
  customer: Customer = new Customer();
  playPrice!: any;
  tokenLogo: string = Constants.TOKEN_LOGO;
  bidHammerIcon = Constants.BID_HAMMER_ICON;
  tokenName: string = Constants.TOKEN_NAME;
  form: FormGroup = new FormGroup({});

  constructor(
    private dialogRef: MatDialogRef<BuyPlayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private walletService: UserWalletService,
    private pubsubService: PubsubService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // this.getPlayPackages();
    this.getPlayPrice();
    this.customer.deserialize(CustomUtils.getCurrentCustomer());
  }

  createForm() {
    this.form = this.fb.group({
      playFormControl: [0, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1), Validators.max(1000)]],
      bigFormControl: [{value: 0, disabled: true}, [Validators.required]],
    });
    this.form.controls.playFormControl.valueChanges.subscribe(val => {
      console.log('play ==> ', val);
      let play = 0;
      if(val) {
        play = val;
      }
      let big = (this.playPrice.play * play) / this.playPrice.big;
      console.log('big ==> ', big);
      this.form.controls.bigFormControl.setValue(big);
    });
  }

  getPlayPackages() {
    this.walletService.getPlayPackages().subscribe(res => {
      this.playPackages = res;
      this.isLoading = false;
    });
  }

  getPlayPrice() {
    this.walletService.getPlayPrice().subscribe(res => {
      this.playPrice = res;
      this.createForm();
      this.isLoading = false;
    });
  }

  buyPlay(playPackage: any) {
    console.log('Package ==> ', playPackage);
    this.buyButtonDisabled = true;
    let postData: BuyPlayPackageInterface = {
      payment_method: 'big_token',
      play_package_id: playPackage.id,
      user_id: this.customer.id
    };
    this.walletService.buyPlayPackage(postData)
    .subscribe(data => {
      this.dialogRef.close();
    });
  }

  onSubmit() {
    let values = this.form.getRawValue();
    console.log(values);
    this.pubsubService.publish(
      new WalletTransactionMessage({
        action: 'transfer',
        amount: values.bigFormControl
      })
    );
  }

}
