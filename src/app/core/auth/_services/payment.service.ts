import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

// Environment
import {CreateURL} from './publicURL'

const _url = CreateURL.createURL;


@Injectable({
    providedIn: 'root'
})


export class paymentService {
  
     paymentsURL=_url('admin/payments');
    
    constructor(private http: HttpClient) { }
    headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');
   getpaymentsInformation():Observable<any> {
     return this.http.get<any>(`${this.paymentsURL}`,{ headers: this.headers })
   } 

   updatepaymentsInformation(setting):Observable<any> {
    return this.http.put<any>(`${this.paymentsURL}`,setting,{ headers: this.headers })
  } 
   
   

    
}