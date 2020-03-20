import { Injectable, Injector } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpInterceptor} from '@angular/common/http'
import {AuthService} from '../auth/_services/auth.service'
@Injectable({
  providedIn: 'root'
})
export class InterceptorTokenService implements HttpInterceptor {
  constructor(private inject:Injector) { }
intercept(req,next)
{
 let auth=this.inject.get(AuthService);
 let token;
 
 if(auth.getToken())
 {
   token=req.clone({
   setHeaders:{Authorization:`Bearer ${auth.getToken()}`}
   
  })
}
else{
  token=req.clone({
    setHeaders:{}
   })
}
return next.handle(token)
}
  
}
