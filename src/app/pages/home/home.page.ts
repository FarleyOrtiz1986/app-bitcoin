import { Component } from '@angular/core';
import { Bitcoin } from 'src/app/core/models/bitcoin.interface';
import { ExchangeRates } from 'src/app/core/models/exchangeRates.interface';
import { BitcoinService } from 'src/app/core/services/bitcoin.service';
import { ConexionService } from 'src/app/core/services/conexion.service';
import { FinancialService } from 'src/app/core/services/financial.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private STORAGE_HISTORY_BITCOIN = environment.storageHistoryBitcoin;
  private STORAGE_BITCOIN = environment.storageBitcoin;
  private STORAGE_EXCHANGE_RATE = environment.storageExchangeRate;
  private STORAGE_LAST_DATE_INFO = environment.lastDateInformation;

  bitcoinHistory: Array<Bitcoin> | undefined;
  currentBitcoin: Bitcoin | undefined;
  exchangeRate: ExchangeRates | undefined;

  theresInternet: boolean;
  lastUpdate: string;


  constructor(private bitcoinSvc: BitcoinService,
    private dinancialSvc: FinancialService,
    private conexionSvc: ConexionService) {

    this.conexionSvc.getConection().subscribe((data)=>{
      this.theresInternet=data;
    })

    this.conexionSvc.validarConexionAInternet();

    this.getBitcoin();
    this.getHistoryBitcoin();
    this.getExchangeRate();
    setInterval(() => this.getBitcoin(), 60000);

  }


  getExchangeRate() {
    if(this.conexionSvc.validarConexionAInternet()){
      this.dinancialSvc.getExchangeRate(-14).subscribe(data => {
        this.exchangeRate = data;
        if (localStorage) {
          localStorage.setItem(this.STORAGE_EXCHANGE_RATE, JSON.stringify(this.exchangeRate));
        }
      });
    } else {
      if(localStorage){
        if (this.STORAGE_HISTORY_BITCOIN in localStorage){
          this.exchangeRate = JSON.parse(localStorage.getItem(this.STORAGE_EXCHANGE_RATE )!);
        }
      }
    }
  }

  getBitcoin() {
    if(this.conexionSvc.validarConexionAInternet()){
      this.bitcoinSvc.getPriceBitcoins()
      .subscribe(data => {
        let today = new Date();
        this.currentBitcoin = data.bitcoin;
        this.currentBitcoin.last_updated_at = today.getDate() + " de " + this.replaceMonth(today.getMonth() + 1) + " de " + today.getFullYear();
        if (localStorage) {
          localStorage.setItem(this.STORAGE_BITCOIN, JSON.stringify(this.currentBitcoin));
          localStorage.setItem(this.STORAGE_LAST_DATE_INFO, JSON.stringify(this.currentBitcoin.last_updated_at));
          this.lastUpdate = this.currentBitcoin.last_updated_at;
        }
      });
    } else {
      if(localStorage){
        if (this.STORAGE_BITCOIN in localStorage){
          this.currentBitcoin = JSON.parse(localStorage.getItem(this.STORAGE_BITCOIN )!);
        }
        if(this.STORAGE_LAST_DATE_INFO in localStorage){
          this.lastUpdate = JSON.parse(localStorage.getItem(this.STORAGE_LAST_DATE_INFO )!);
        }
      }
    }
  }


  getHistoryBitcoin() {
    if(this.conexionSvc.validarConexionAInternet()){
      this.bitcoinSvc.getHistoryBitcoinLastDays(14)
      .subscribe(data => {
        var dataTemp = "";
        var dataTempNew = ""
        this.bitcoinHistory = [];

        var unix_timestamp = data[0][0];
        var date = new Date(unix_timestamp);
        dataTemp = date.getDate() + " de " + this.replaceMonth(date.getMonth() + 1) + " de " + date.getFullYear();

        data.forEach(element => {
          unix_timestamp = element[0]
          date = new Date(unix_timestamp);
          dataTempNew = date.getDate() + " de " + this.replaceMonth(date.getMonth() + 1) + " de " + date.getFullYear();
          if (dataTemp !== dataTempNew) {
            let bitcoin = {} as Bitcoin;
            bitcoin.last_updated_at = dataTempNew;
            bitcoin.usd = element[4];
            dataTemp = dataTempNew;
            this.bitcoinHistory.unshift(bitcoin);
          }
        });

        if (localStorage) {
          localStorage.setItem(this.STORAGE_HISTORY_BITCOIN, JSON.stringify(this.bitcoinHistory));
        }
      });
    } else {
      if(localStorage){
        if (this.STORAGE_HISTORY_BITCOIN in localStorage){
          this.bitcoinHistory = JSON.parse(localStorage.getItem(this.STORAGE_HISTORY_BITCOIN )!);
        }
      }
    }
  }


  replaceMonth(month: number): string {
    if (month === 1)
      return "Enero";
    else if (month === 2)
      return "Febrero";
    else if (month === 3)
      return "Marzo";
    else if (month === 4)
      return "Abril";
    else if (month === 5)
      return "Mayo";
    else if (month === 6)
      return "Junio";
    else if (month === 7)
      return "Julio";
    else if (month === 8)
      return "Agosto";
    else if (month === 9)
      return "Semptiembre";
    else if (month === 10)
      return "Octubre";
    else if (month === 11)
      return "Noviembre";
    else if (month === 12)
      return "Diciembre";
  }

}
