import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PubsubService } from '@fsms/angular-pubsub';
import { Msg } from 'src/app/helper/msg.helper';
import { CustomerTokenPostBody } from 'src/app/interface/customer-token-post-body.interface';
import { CustomerCreate } from 'src/app/model/customer-create.model';
import { Customer } from 'src/app/model/customer.model';
import { AuthDialogMessage } from 'src/app/pub_sub/auth-dialog-message';
import { CustomerAccountManagementService } from 'src/app/service/customer-account-management.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

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
        password: ['', [Validators.required, Validators.minLength(8)]],
        customer: this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          firstname: ['', [Validators.required, Validators.minLength(3)]],
          lastname: ['', [Validators.required, Validators.minLength(3)]]
        })
    });
  }

  publishMessage(actionData: 'open'|'close') {
    this.pubsubService.publish(
      new AuthDialogMessage({
        form: 'login',
        action: actionData
      })
    );
  }

  goToLogin() {
    this.publishMessage('open');
  }

  private prepareSubmit(): CustomerCreate {
    console.log('this.form ==> ', this.form.value);
    return new CustomerCreate().deserialize(this.form.value);
  }

  onSubmit() {
    const customerData: CustomerCreate = this.prepareSubmit();
    console.log('customerData ==> ', customerData);
    this.customerService.createCustomer(customerData).subscribe((response: Customer) => {
      console.log('customer created ==> ', response);
      this.msg.showMessage('Account has been created successfully.');
      // Do Login:
      const customerTokenPostBody: CustomerTokenPostBody = {
        username: customerData.customer.email,
        password: customerData.password
    }
      this.customerService.getCustomerToken(customerTokenPostBody).subscribe((token: string) => {
        this.customerService.setCustomerToken(token);
        this.publishMessage('close');
      });
    } , error => {
      console.log('customer registration failed ==> ', error.error.message);
      this.msg.showMessage(error.error.message);
    });
  }

}
