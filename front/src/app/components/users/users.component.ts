import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'], 
})
export class UserComponent  implements OnInit{

constructor(private connectionservice:ConnectionService){}
view: string = 'A'; 
filteredUserList: User[] = [];
currentUser: User | null = null;
userList: User[] = [];
sortColumn: string = ''; 
sortDirection: 'asc' | 'desc' = 'asc';
newUser: User = {
  matricule:0,
  password:"",
  nom_prenom:"",
};


ngOnInit(): void {
  this.fetchUsers();
  }

  switchToViewA(): void {
    this.view = 'A';
    this.fetchUsers();
  }

  switchToViewB(): void {
    this.view = 'B';
  }


  fetchUsers(): void {
    this.connectionservice.getUser().subscribe(data => {
      this.userList = Array.isArray(data) ? data : [];
      console.log("kjvdjvdvf",this.userList)

      this.filteredUserList = [...this.userList];
  
      console.log(this.userList);
    });
  }
  
  
  
  
  
    sort(column: keyof User): void {
      if (this.sortColumn === column) {

        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {

        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
    
      this.filteredUserList = this.filteredUserList.sort((a, b) => {
        let valueA: any = a[column];
        let valueB: any = b[column];
    
        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    



  signout():void{
    this.connectionservice.signout().subscribe({
      next: () => {console.log('User signed out');
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

  deleteUser(matricule: number | undefined): void {
    if (matricule === undefined) {
      console.error('No expertise number provided for deletion');
      return;
    }
    this.connectionservice.deleteUser(matricule).subscribe({
      next: () => {
        this.fetchUsers();
      },
      error: error => {
        console.error('Error deleting expertise:', error);
      }
    });
  }
  


addUser(): void {
    const matriculeNumber = Number(this.newUser.matricule);
    const userToAdd: User = {
      matricule: matriculeNumber,
      password: this.newUser.password,
      nom_prenom: this.newUser.nom_prenom
    };

  this.connectionservice.adduser(userToAdd).subscribe({
    next: () => {
      this.fetchUsers();
      this.view = 'A';
    },
    error: error => {
      console.error('Error adding user:', error);
    }
  });
}



search(searchTerm: string): void {

    const lowerCaseTerm = searchTerm.toLowerCase();

    this.filteredUserList = this.userList.filter(user =>
      (user.matricule.toString().toLowerCase().includes(lowerCaseTerm) ?? false) ||
      (user.nom_prenom?.toLowerCase().includes(lowerCaseTerm))
    );

    (document.getElementById('search-input') as HTMLInputElement).value = '';
  
    console.log('Filtered userList:', this.filteredUserList);
  }
  



}

    