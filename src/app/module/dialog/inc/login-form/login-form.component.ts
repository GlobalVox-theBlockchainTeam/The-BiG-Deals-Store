import { Component, OnInit } from '@angular/core';
import { CustomerTokenPostBody } from 'src/app/interface/customer-token-post-body.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PubsubService } from '@fsms/angular-pubsub';
import { AuthDialogMessage } from 'src/app/pub_sub/auth-dialog-message';
import { CustomerAccountManagementService } from 'src/app/service/customer-account-management.service';
import { Msg } from 'src/app/helper/msg.helper';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private pubsubService: PubsubService,
    private customerService: CustomerAccountManagementService,
    private msg: Msg
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]  
    });
  }

  publishMessage(actionData: 'open'|'close') {
    this.pubsubService.publish(
      new AuthDialogMessage({
        form: 'register',
        action: actionData
      })
    );
  }

  goToRegister() {
    this.publishMessage('open');
  }

  private prepareSubmit(): CustomerTokenPostBody {
    console.log('this.form ==> ', this.form.value);
    return this.form.value;
  }

  onSubmit() {
    const customerTokenPostBody: CustomerTokenPostBody = this.prepareSubmit();
    console.log('customerTokenPostBody ==> ', customerTokenPostBody);
    this.customerService.getCustomerToken(customerTokenPostBody).subscribe((token: string) => {
      this.customerService.setCustomerToken(token);
      this.msg.showMessage('Login successful.');
      this.publishMessage('close');
    }, error => {
      this.msg.showMessage(error.error.message);
    });
  }

}
