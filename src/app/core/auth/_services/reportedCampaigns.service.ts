import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

// Environment
import {CreateURL} from './publicURL'

const _url = CreateURL.createURL;

@Injectable({
    providedIn: 'root'
})

export class reportedCampaigns {

	campaignsURL=_url('admin/campaigns/reported');

 constructor(private http: HttpClient) { }
 headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');
 getcampaignsInformation():Observable<any> {
     return this.http.get<any>(`${this.campaignsURL}`,{ headers: this.headers })
   }

  deleteCampaigns(id): Observable<any> {
    return this.http.delete<any>(`${this.campaignsURL}/${id}`)
  }

  getCampaignsById(id): Observable<any> {
    return this.http.get<any>(`${this.campaignsURL}/${id}`)
  }
}
