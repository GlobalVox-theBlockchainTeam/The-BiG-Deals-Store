import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Msg } from 'src/app/helper/msg.helper';
import { WalletPairingPostBodyInterface } from 'src/app/interface/wallet-pairing-post-body.interface';
import { UserWalletService } from 'src/app/service/user-wallet.service';

@Component({
  selector: 'app-wallet-pairing-dialog',
  templateUrl: './wallet-pairing-dialog.component.html',
  styleUrls: ['./wallet-pairing-dialog.component.scss']
})
export class WalletPairingDialogComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  constructor(
    private dialogRef: MatDialogRef<WalletPairingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private userWalletService: UserWalletService,
    private msg: Msg
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      seed: ['', [Validators.required]],
      pass: ['', [Validators.required]],
      wallet: ['', [Validators.required]]
    });
  }

  private prepareSubmit(): WalletPairingPostBodyInterface {
    console.log('this.form ==> ', this.form.value);
    return this.form.value;
  }

  onSubmit() {
    const walletPairingPostBody: WalletPairingPostBodyInterface = this.prepareSubmit();
    console.log('walletPairingPostBody ==> ', walletPairingPostBody);
    this.userWalletService.pairWallet(walletPairingPostBody).subscribe((res: any) => {
      console.log('pairing response ==> ', res);
      if (res.address !== '') {
        this.msg.showMessage('Wallet paired successfully');
        this.close(res);
      } else {
        this.msg.showMessage('incorrect Wallet pairing details');
        this.form.reset();
      }
    }, error => {
      console.log('paiting error ==>', error.error.message);
      this.form.reset();
      this.msg.showMessage(error.error.message);
    });
  }

  close(data: any): void {
    this.dialogRef.close(data)
  }
}
