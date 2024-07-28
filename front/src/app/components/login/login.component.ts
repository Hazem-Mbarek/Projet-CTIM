import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { ConnectionService } from '../../services/connection.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CookieModule } from 'ngx-cookie';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,CookieModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  view: string = 'A';
  user: User = {
    matricule:0,
    password: '',
    nom_prenom: ''
  };
  matricule: string = '';  
  password: string = '';
  nom_prenom: string = '';  
  errorMessage: string | null = null;
  isAuthenticated: boolean = false;

  constructor(
    private connectionservice:ConnectionService, private router: Router,private cookieService: CookieService
  ){}



  signIn(): void {
    if (this.matricule === '' || this.password === '' || this.nom_prenom === '') {
      this.errorMessage = 'Matricule, Password, and Nom Prenom are required';
      return;
    }

    const matriculeNumber = Number(this.matricule);
    if (isNaN(matriculeNumber)) {
      this.errorMessage = 'Matricule must be a number';
      return;
    }

    const user: User = {
      matricule: matriculeNumber,
      password: this.password,
      nom_prenom: this.nom_prenom
    };

    this.connectionservice.signIn(user).subscribe({
      next: (response) => {
        console.log('Sign-in successful:', response);
        this.isAuthenticated = true;
        this.nom_prenom = response.nom_prenom || 'User';
        this.view = 'B';
        
        // Store token and reset form fields
        localStorage.setItem('token', response.token);
        this.matricule = '';
        this.password = '';
        this.nom_prenom = '';

        // Navigate to another route (uncomment if needed)
        // this.router.navigate(['/expertises']);
        
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Sign-in error:', error);

        // Display specific error messages based on server response
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Invalid credentials or server error.';
        }
      }
    });
  }

  setCookie(cookie:string):void{
    document.cookie=cookie;
  }



  signout():void{
    this.connectionservice.signout().subscribe({
      next: () => {console.log('User signed out');
        this.isAuthenticated = false;
        this.view='A';
        localStorage.removeItem('token');
        window.location.href = 'http://localhost:4200';
        if (localStorage.getItem('token') === null) {
          console.log('Token removed successfully');
        } else {
          console.log('Failed to remove token');
        }
      },
      error: error => {
        console.error('Error updating expertise:', error);
      }
    });
  }


  emptyfct(): void {
   
  }



}
