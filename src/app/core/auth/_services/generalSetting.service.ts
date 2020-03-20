// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { CreateURL } from './publicURL'
const _url = CreateURL.createURL;
@Injectable({
  providedIn: 'root'
})


export class generalSettingService{
    settingsURL = _url('admin/settings');
    constructor(private http: HttpClient) { }
    headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    getAllSetting(): Observable<any> {
      return this.http.get<any>(`${this.settingsURL}`)
    }

    updateSetting(setting): Observable<any> {
      return this.http.put<any>(`${this.settingsURL}`,setting)
    }

    getLimitSetting(): Observable<any> {
      return this.http.get<any>(`${this.settingsURL}/limits`)
    }
    updateLimitSetting(setting): Observable<any> {
      return this.http.put<any>(`${this.settingsURL}/limits`,setting)
    }
}