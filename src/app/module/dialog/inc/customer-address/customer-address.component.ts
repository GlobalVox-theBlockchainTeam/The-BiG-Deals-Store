import { Component, EventEmitter, forwardRef, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/helper/constants.helper';
import { CustomUtils } from 'src/app/helper/custom-utils.helper';
import { Msg } from 'src/app/helper/msg.helper';
import { AddressData, AddressPostInterface } from 'src/app/interface/address-post.interface';
import { CustomerTokenPostBody } from 'src/app/interface/customer-token-post-body.interface';
import { Address, Country } from 'src/app/model/address.model';
import { Customer } from 'src/app/model/customer.model';
import { AddressService } from 'src/app/service/address.service';
import { CustomerAccountManagementService } from 'src/app/service/customer-account-management.service';

@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.scss']
})
export class CustomerAddressComponent implements OnInit {

  customer: Customer = new Customer();
  isLoading: boolean = true;
  showForm: boolean = false;
  form: FormGroup = new FormGroup({});
  countryList: Country[] = [];
  region!: Country;

  @Output() saveAndNext: EventEmitter<any> = new EventEmitter();

  constructor(
    private customerService: CustomerAccountManagementService,
    private fb: FormBuilder,
    private addressService: AddressService,
    private msg: Msg
  ) { }

  ngOnInit(): void {
    console.log("Check for customer address");
    this.getCurrentCustomer();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      countryId: ['', [Validators.required]],
      region: ['', [Validators.required]],
      streetData: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postcode: ['', [Validators.required]],
      company: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]]
    });

    this.form.controls.countryId.valueChanges.subscribe( val => {
      this.addressService.getRegionsByCountry(val).subscribe(res => {
        this.region = res;
      });
    })
  }

  getCountryList() {
    if (this.countryList.length === 0) {
      this.addressService.getCountries().subscribe( res => {
        this.countryList = res;
      });
    }
  }

  getCurrentCustomer() {
    if (CustomUtils.isLoggedIn()) {
      this.customerService.getCustomer().subscribe((res: Customer) => {
        this.customer.deserialize(res);
        console.log('this.customer ==> ', this.customer);
        this.isLoading = false;
        if (this.customer.addresses.length === 0) {
          this.openAddressForm();
        }
      });
    }
  }

  private prepareSubmit(): AddressPostInterface {
    console.log('this.form ==> ', this.form.value);
    const formValues = this.form.value; 
    const address: AddressData = {
      city: formValues.city,
      company: formValues.company,
      countryId: formValues.countryId,
      email: formValues.email,
      firstname: formValues.firstname,
      lastname: formValues.lastname,
      postcode: formValues.postcode,
      region: formValues.region,
      saveInAddressBook: 1,
      street: [formValues.streetData],
      telephone: formValues.telephone
    };
    const addressPostData: AddressPostInterface = {
      addressInformation: {
        shippingAddress: address,
        billingAddress: address,
        shippingCarrierCode: 'flatrate',
        shippingMethodCode: 'flatrate'
      }
    };
    return addressPostData;
  }

  submitExistingAddress(data: Address) {
    const address: AddressData = {
      city: data.city,
      company: data.company,
      countryId: data.country_id,
      email: this.customer.email,
      firstname: data.firstname,
      lastname: data.lastname,
      postcode: data.postcode,
      region: data.region.region_code,
      street: data.street,
      telephone: data.telephone,
      // id: data.id
    };
    const addressPostData: AddressPostInterface = {
      addressInformation: {
        shippingAddress: address,
        billingAddress: address,
        shippingCarrierCode: 'flatrate',
        shippingMethodCode: 'flatrate'
      }
    };
    this.saveAddress(addressPostData);
  }

  onSubmit() {
    const address: AddressPostInterface = this.prepareSubmit();
    console.log('addressPostInterface ==> ', address);
    this.saveAddress(address);
  }

  saveAddress(address: AddressPostInterface) {
    this.addressService.saveCustomerAddress(address).subscribe((res: any) => {
      this.msg.showMessage('Address successfully saved');
      this.saveAndNext.emit(res);
    }, error => {
      this.msg.showMessage(error.error.message);
    });
  }

  openAddressForm() {
    this.getCountryList();
    this.showForm = true;
  }

  closeAddressForm() {
    this.showForm = false;
  }

}
