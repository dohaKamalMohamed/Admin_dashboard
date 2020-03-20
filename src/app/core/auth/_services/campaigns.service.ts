import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { CreateURL } from './publicURL'
const _url = CreateURL.createURL;
@Injectable({
  providedIn: 'root'
})

export class campaignsService {
  campaignsURL = _url('admin/campaigns');
  constructor(private http: HttpClient) { }
  headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  getAllCampaigns(): Observable<any> {
    return this.http.get<any>(`${this.campaignsURL}`)
  }

}