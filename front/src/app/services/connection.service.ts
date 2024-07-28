import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user';
import { Expertise } from '../models/expertise';
import { Imputation } from '../models/imputations';
import { Travail } from '../models/travail';
import { Piece } from '../models/piece';
import { Appareil } from '../models/appareil';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(
    private http:HttpClient
  ) { }
  API_URL=environment.API_URL;
  //, { withCredentials: true }


  //expertise******************************************************************************************************

  getExpertise(): Observable<Expertise[]> {
    return this.http.get<Expertise[]>(this.API_URL+"expertises", { withCredentials: true }); 
  }

  getPdf(num_exp: number): Observable<Blob> {
    const url = `http://localhost:5000/pdf/${num_exp}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  addExpertise(expertise: Omit<Expertise, 'num_exp'>): Observable<Expertise> {
    return this.http.post<Expertise>(`${this.API_URL}expertises/ajout`, expertise, {
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteExpertise(num_exp: number): Observable<any> {
    return this.http.delete(`${this.API_URL}expertises/${num_exp}`);
  }
  
  updateExpertise(expertise: Expertise): Observable<Expertise> {
    return this.http.patch<Expertise>(`${this.API_URL}expertises/${expertise.num_exp}`, expertise);
  }

  confirmExpertise(expertise: Expertise): Observable<Expertise> {
    return this.http.patch<Expertise>(`${this.API_URL}expertises/${expertise.num_exp}/confirm`, expertise);
  }
//travail***********************************************************************************************************************
getTravail(num_exp: string): Observable<Travail[]> {
  return this.http.get<Travail[]>(`${this.API_URL}travaux/${num_exp}`, { withCredentials: true }); 
}

getAppHistory(code_app: string): Observable<Travail[]> {
  return this.http.get<Travail[]>(`${this.API_URL}travaux/history/${code_app}`, { withCredentials: true }); 
}
addTravail(travail: Omit<Travail, 'num_exp'>): Observable<Travail> {
  return this.http.post<Travail>(`${this.API_URL}travaux/ajout`, travail, {
  }).pipe(
    catchError(this.handleError)
  );
}

updateTravail(travail: Travail): Observable<Travail> {
  return this.http.patch<Travail>(`${this.API_URL}travaux/${travail.num_exp}/${travail.code_app}/${travail.code_piece}`, travail);
}

deleteTravail(num_exp: number,code_app:string,code_piece:string): Observable<any> {
  return this.http.delete(`${this.API_URL}travaux/${num_exp}/${code_app}/${code_piece}`);
}
//auth***********************************************************************************************************************

 signout(): Observable<any> {
    return this.http.get(`${this.API_URL}auth/signout`);
  }

  signIn(user: User): Observable<any> {
    return this.http.post(`${this.API_URL}auth/signin`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  //imputation*********************************************************************************************
  getImputation(): Observable<Imputation[]> {
    return this.http.get<Imputation[]>(this.API_URL+"imputations"); 
  }
  getImputationsUR(): Observable<Imputation[]> {
    return this.http.get<Imputation[]>(this.API_URL+"imputations/unique"); 
  }

//piece*********************************************************************************************
  getPiece(): Observable<Piece[]> {
    return this.http.get<Piece[]>(`${this.API_URL}pieces`, { withCredentials: true }); 
  }
  //appareil*********************************************************************************************
  getAppareil(): Observable<Appareil[]> {
    return this.http.get<Appareil[]>(`${this.API_URL}appareils`, { withCredentials: true }); 
  }
  //User*********************************************************************************************

  getUser(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}utilisateurs`)
      .pipe(
        catchError(this.handleError)
      );
  }
  deleteUser(matricule: number): Observable<any> {
    return this.http.delete(`${this.API_URL}utilisateurs/${matricule}`);
  }
  
  adduser(user: Omit<User, 'matricule'>): Observable<User> {
    return this.http.post<User>(`${this.API_URL}utilisateurs/ajout`, user, {
    }).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error); 
    return throwError(() => new Error(error.message || 'An unknown error occurred')); 
  }


}
