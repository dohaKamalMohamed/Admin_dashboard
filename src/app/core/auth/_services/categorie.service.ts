import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { CreateURL } from './publicURL'
const _url = CreateURL.createURL;
@Injectable({
  providedIn: 'root'
})

export class categoriesService {
  categoriesURL = _url('admin/categories');
  constructor(private http: HttpClient) { }
  headers: HttpHeaders = new HttpHeaders().set('Content-Type', ['application/json', 'multipart/form-data']);
  
  getAllcategories(): Observable<any> {
    return this.http.get<any>(`${this.categoriesURL}`)
  }

  deleteCategorie(id): Observable<any>  {
    return this.http.delete<any>(`${this.categoriesURL}/${id}`)
  }

  getCategorieById(id): Observable<any> {
    return this.http.get<any>(`${this.categoriesURL}/${id}`)
  }

  postCategorie(category): Observable<any> {
    return this.http.post<any>(`${this.categoriesURL}`,category)
  }

  updateCategory(id,category): Observable<any> {
    return this.http.put<any>(`${this.categoriesURL}/${id}`,category)
  }

}
