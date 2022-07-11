import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bitcoin } from '../models/bitcoin.interface';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BitcoinService {


  constructor(private http: HttpClient) { }


  getPriceBitcoins():Observable<any>{
    return this.http.get<Bitcoin>('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        'ids': 'bitcoin',
        'vs_currencies':'usd,eur',
        'include_last_updated_at': 'true'
      }
    });
  }


  getHistoryBitcoinLastDays(day:number):Observable<any>{
    return this.http.get<any>('https://api.coingecko.com/api/v3/coins/bitcoin/ohlc', {
      params: {
        'vs_currency': 'usd',
        'days': day,
        'interval': 'daily'
      }
    });
  }


}