import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PubsubService, PubsubSubscription } from '@fsms/angular-pubsub';
import { Subscription } from 'rxjs';
import { AuthDialogMessage } from 'src/app/pub_sub/auth-dialog-message';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit {

  formType: string = 'login';
  s!: PubsubSubscription;

  constructor(
    private dialogRef: MatDialogRef<AuthDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private pubsubService: PubsubService
  ) { }

  ngOnInit(): void {
    this.s = this.pubsubService.subscribe({
      messageType: AuthDialogMessage.messageType,
      callback: (msg) => {
        console.log('open login dialog event received', msg);
        if(msg?.message?.payload?.action === 'open') {
          this.formType = msg?.message?.payload?.form;
        } else {
          this.close();
        }
        
      },
    })
  }

  close(): void {
    this.dialogRef.close({success: true})
  }

  ngOnDestroy(): void {
    this.s.unsubscribe();
  }
}
