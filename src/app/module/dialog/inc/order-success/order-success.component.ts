import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent implements OnInit {

  @Input() orderId = '';

  constructor() { }

  ngOnInit(): void {
  }
}
