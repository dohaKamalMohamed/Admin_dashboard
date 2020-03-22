import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

// Environment
import {CreateURL} from './publicURL'

const _url = CreateURL.createURL;


@Injectable({
    providedIn: 'root'
})


export class memberService {

     membersURL=_url('admin/members');
     countriesURL=_url('countries')

    constructor(private http: HttpClient) { }
    headers:HttpHeaders =new HttpHeaders().set('Content-Type','application/json');
   getmembersInformation():Observable<any> {
     return this.http.get<any>(`${this.membersURL}`,{ headers: this.headers })
   }



  deleteMember(id): Observable<any> {
    return this.http.delete<any>(`${this.membersURL}/${id}`)
  }

  getMemberById(id): Observable<any> {
    return this.http.get<any>(`${this.membersURL}/${id}`)
  }

  addNewMember(member): Observable<any>{
    return this.http.post<any>(`${this.membersURL}`,member)
  }

  
  updateMember(id,member): Observable<any>{
    return this.http.put<any>(`${this.membersURL}/${id}`,member)
  }

  getAllCountries():Observable<any>{
    return this.http.get<any>(`${this.countriesURL}`,{ headers: this.headers })
  }

}
