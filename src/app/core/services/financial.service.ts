


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bitcoin } from '../models/bitcoin.interface';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  private readonly API_KEY_LAYER = environment.openFinancialApilayer.key

  constructor(private http: HttpClient) { }


  getExchangeRate(pastDays:number ):Observable<any>{
  
    return this.http.get<any>('https://api.apilayer.com/exchangerates_data/timeseries'  , {
      headers: {
        'apikey': this.API_KEY_LAYER,
      },
      params: {
        'apikey': this.API_KEY_LAYER,
        'start_date': this.getSpecifiedDate(pastDays),
        'end_date': this.getSpecifiedDate(0),
        'base': 'USD'
      },

    });
  }


  /**
   * [getSpecifiedDate: Gets the calculated date in the format yyyy-mm-dd]
   *
   * @param   {number}  days  [days: Number of days subtracted or added to the current date]
   *
   * @return  {string}        [return: Date in the format yyyy-mm-dd]
   */
   getSpecifiedDate(days: number): string {
    let day = "0";
    let month = "0";
    let year = "0";

    let today = new Date();
    let date = new Date(today.getTime() + 1000 * 60 * 60 * 24 * days);

    if (date.getDate() <= 9)
      day = "0" + date.getDate(); //Secure the format dd
    else
      day = date.getDate().toString();

    if ((date.getMonth() + 1) <= 9)
      month = "0" + (date.getMonth() + 1); //Secure the format mm
    else
      month = (date.getMonth() + 1).toString();

    year = date.getFullYear().toString();

    let formattedDate = year + "-" + month + "-" + day;

    return formattedDate;
  }


}
