import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerAccountManagementService } from './service/customer-account-management.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bitbid';

  constructor(
    private customerAccountManagementService: CustomerAccountManagementService,
    private route: ActivatedRoute
    ) {
    customerAccountManagementService.setCustomer();
  }

}
