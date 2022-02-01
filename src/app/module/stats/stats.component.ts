import { Component, OnInit } from '@angular/core';
import { ServerStatsService } from 'src/app/service/server-stats.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  auctionDetails!: any;
  productId = 1;

  constructor(
    private serverStatsService: ServerStatsService
  ) { }

  ngOnInit(): void {
    setInterval( () => {
      this.getAuctionDetails();
    }, 5000);
    
  }

  getAuctionDetails() {
    this.serverStatsService.getAuctionDetails(this.productId).subscribe(res => {
      this.auctionDetails = res;
    })
  }

  enableViableProduct() {
    this.serverStatsService.enableViableProduct(this.productId).subscribe(res => {
      this.getAuctionDetails();
    });
  }

  disableViableProduct() {
    this.serverStatsService.disableViableProduct(this.productId).subscribe(res => {
      this.getAuctionDetails();
    });
  }

  resetAuction() {
    this.serverStatsService.resetAuction(this.productId).subscribe(res => {
      this.getAuctionDetails();
    });
  }

}
