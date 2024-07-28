import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import { CommonModule} from '@angular/common';
import { Appareil } from '../../models/appareil';

@Component({
  selector: 'app-appareil',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './appareil.component.html',
  styleUrls: ['./appareil.component.scss'],
})
export class AppareilComponent  implements OnInit{
constructor(
  private connectionservice:ConnectionService,
){}
appareilList: Appareil[] = [];
filteredAppareilList: Appareil[] = [];

sortColumn: string = ''; 
sortDirection: 'asc' | 'desc' = 'asc';

ngOnInit(): void {
    this.fetchAppareils();
    }


  
async fetchAppareils(): Promise<void> {
    try {
  
      const data = await this.connectionservice.getAppareil().toPromise();
  
      this.appareilList = Array.isArray(data) ? data : [];
    
  
      this.filteredAppareilList = [...this.appareilList];
  
 
      console.log('Filtered appareil list:', this.filteredAppareilList);
    } catch (error) {
      console.error('Error fetching appareils:', error);
    }
  }

      search(searchTerm: string): void {
        const lowerCaseTerm = searchTerm.toLowerCase();
        
      
        this.filteredAppareilList = this.appareilList.filter(appareil =>
          (appareil.code_app.toLowerCase().includes(lowerCaseTerm)) ||
          (appareil.UR.toString().toLowerCase().includes(lowerCaseTerm)) ||
          (appareil.section.toString().toLowerCase().includes(lowerCaseTerm))||
          (appareil.type.toLowerCase().includes(lowerCaseTerm)) ||
          (appareil.etat.toLowerCase().includes(lowerCaseTerm))||
          (appareil.classImp?.toLowerCase().includes(lowerCaseTerm)?? false) ||
          (appareil.annee_acqui.toString().toLowerCase().includes(lowerCaseTerm))||
          (appareil.designation.toLowerCase().includes(lowerCaseTerm))
        );
      
        // Reset the search input field
        (document.getElementById('search-input') as HTMLInputElement).value = '';
      
        console.log('Filtered PieceList:', this.filteredAppareilList);
      }
      
      
        sort(column: keyof Appareil): void {
          if (this.sortColumn === column) {
      
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
          } else {
      
            this.sortColumn = column;
            this.sortDirection = 'asc';
          }
        
          this.filteredAppareilList = this.filteredAppareilList.sort((a, b) => {
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
}