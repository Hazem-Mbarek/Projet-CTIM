import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loginUrl = 'localhost:5000/auth/signin'; // Adjust the login URL accordingly
    const token = localStorage.getItem('token');
    //console.log("Token retrieved from local storage:", token);

    // Check if the request URL matches the login URL
    if (req.url.includes(loginUrl)) {
      //console.log("Login request detected, passing request without modification.");
      return next.handle(req);
    }

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      //console.log("Cloned request with Authorization header:", cloned);
      return next.handle(cloned);
    } else {
      //console.log("No token found, passing request without modification.");
      return next.handle(req);
    }
  }
}
