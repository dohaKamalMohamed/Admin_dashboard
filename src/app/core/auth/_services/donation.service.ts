import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { CreateURL } from './publicURL'
const _url = CreateURL.createURL;
@Injectable({
  providedIn: 'root'
})

export class donationsService {
  donationsURL = _url('admin/donations');
  constructor(private http: HttpClient) { }
  headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  getAllDonations(): Observable<any> {
    return this.http.get<any>(`${this.donationsURL}`)
  }

  getDonationByID(id){
    return this.http.get<any>(`${this.donationsURL}/${id}`,{ headers: this.headers })
  }

}