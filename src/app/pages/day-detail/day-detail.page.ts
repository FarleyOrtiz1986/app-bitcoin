import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Bitcoin } from 'src/app/core/models/bitcoin.interface';
import { ExchangeRates } from 'src/app/core/models/exchangeRates.interface';
import { ConexionService } from 'src/app/core/services/conexion.service';
import { FinancialService } from 'src/app/core/services/financial.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-day-detail',
  templateUrl: './day-detail.page.html',
  styleUrls: ['./day-detail.page.scss'],
})
export class DayDetailPage implements OnInit {

  currentBitcoin: Bitcoin | undefined;
  bitcoinHistory: Array<Bitcoin> | undefined;
  exchangeRate: ExchangeRates | undefined;

  private STORAGE_HISTORY_BITCOIN = environment.storageHistoryBitcoin;
  private STORAGE_BITCOIN = environment.storageBitcoin;
  private STORAGE_EXCHANGE_RATE = environment.storageExchangeRate;
  private STORAGE_LAST_DATE_INFO = environment.lastDateInformation;

  idItem: number;
  theresInternet: boolean;
  lastUpdate: string;


  constructor(private conexionSvc: ConexionService, private financialSvc: FinancialService, private activatedRoute: ActivatedRoute, private router: Router,) { 
    
    this.conexionSvc.getConection().subscribe((data)=>{
      this.theresInternet=data;
    })

    this.conexionSvc.validarConexionAInternet();

    this.lastUpdate = JSON.parse(localStorage.getItem(this.STORAGE_LAST_DATE_INFO )!);
    
    this.idItem = Number(this.activatedRoute.snapshot.paramMap.get("id"));
   
    if( isNaN(this.idItem) || this.idItem < 0)
      this.router.navigate(['/home']);

    if(this.idItem === 0){
      this.currentBitcoin = JSON.parse(localStorage.getItem(this.STORAGE_BITCOIN )!); 
    } else {
      this.bitcoinHistory = JSON.parse(localStorage.getItem(this.STORAGE_HISTORY_BITCOIN )!);
      if(this.bitcoinHistory === undefined || this.bitcoinHistory === null || this.idItem > this.bitcoinHistory.length)
        this.router.navigate(['/home']); 
      this.currentBitcoin = this.bitcoinHistory[this.idItem];
    }
    
    

    this.exchangeRate = JSON.parse(localStorage.getItem(this.STORAGE_EXCHANGE_RATE )!); 
    let dateExchangeRate = this.financialSvc.getSpecifiedDate(this.idItem*-1);
    
    let esxchangeRateEUR = this.exchangeRate.rates[ dateExchangeRate].EUR;
    let esxchangeRateCOP = this.exchangeRate.rates[ dateExchangeRate].COP;

    this.currentBitcoin.eur = this.round(this.currentBitcoin.usd * esxchangeRateEUR);
    this.currentBitcoin.cop = this.round(this.currentBitcoin.usd * esxchangeRateCOP);
  }

  round(num: number) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
}

  ngOnInit() {

   
  }

}
