



import { Injectable } from '@angular/core';
import {  fromEvent, Observable, Subject } from 'rxjs';
import {  debounceTime } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  showConexion = new Subject<boolean>();



  constructor() {
    fromEvent(window, 'offline').pipe(
      debounceTime(100)).subscribe((event: Event) => {
        this.connectionDisabled();
      });
    fromEvent(window, 'online').pipe(
      debounceTime(100)).subscribe((event: Event) => {
        this.establishedConnection();
      });
  }

  validarConexionAInternet() {
    if (!navigator.onLine) {
      this.connectionDisabled();
      return false;
    }
    this.establishedConnection();
    return true;
    
  }


  establishedConnection(): void {
    this.showConexion.next(true);
  }

  connectionDisabled(): void {
    this.showConexion.next(false);
  }

  getConection(): Observable<boolean> {
    return this.showConexion.asObservable();
  }
}
