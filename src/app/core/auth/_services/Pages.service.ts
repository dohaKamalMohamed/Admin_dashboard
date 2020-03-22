import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { CreateURL } from './publicURL'
const _url = CreateURL.createURL;
@Injectable({
  providedIn: 'root'
})
 
export class pagesService {
  pagesURL = _url('admin/pages');
  constructor(private http: HttpClient) { }
  headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  
  getAllpages(): Observable<any> {
    return this.http.get<any>(`${this.pagesURL}`)
  }

  getPageByID(id): Observable<any> {
    return this.http.get<any>(`${this.pagesURL}/${id}`)
  }

  addNewPage(page): Observable<any> {
    return this.http.post<any>(`${this.pagesURL}` ,page)
  }

  deletePage(id): Observable<any> {
    return this.http.delete<any>(`${this.pagesURL}/${id}`)
  }

  updatePage(id,page): Observable<any> {
    return this.http.put<any>(`${this.pagesURL}/${id}` ,page)
  }
}