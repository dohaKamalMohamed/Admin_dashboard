import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

// Environment
import {CreateURL} from './publicURL'

const _url = CreateURL.createURL;


@Injectable({
    providedIn: 'root'
})


export class socialProfileService {
  
     socialURL=_url('admin/profiles-social');
    
    constructor(private http: HttpClient) { }
    headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');
   getSocialProfile():Observable<any> {
     return this.http.get<any>(`${this.socialURL}`,{ headers: this.headers })
   } 


   updateSocialProfile(_socialprofile):Observable<any> {
    return this.http.put<any>(`${this.socialURL}`, _socialprofile)
  } 
   
   
   

    
}