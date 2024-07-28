import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Piece } from '../../models/piece';

@Component({
  selector: 'app-piece',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.scss'],
  providers: [DatePipe] 
})
export class PieceComponent  implements OnInit{
constructor(
  private connectionservice:ConnectionService,
  private datePipe: DatePipe 
){}
pieceList: Piece[] = [];
filteredPieceList: Piece[] = [];

sortColumn: string = ''; 
sortDirection: 'asc' | 'desc' = 'asc';

ngOnInit(): void {
    this.fetchPieces();
    }


  
async fetchPieces(): Promise<void> {
    try {
  
      const data = await this.connectionservice.getPiece().toPromise();
  
      this.pieceList = Array.isArray(data) ? data : [];
    
  
      this.filteredPieceList = [...this.pieceList];
  
 
      console.log('Filtered piece list:', this.filteredPieceList);
    } catch (error) {
      console.error('Error fetching pieces:', error);
    }
  }

      search(searchTerm: string): void {
        const lowerCaseTerm = searchTerm.toLowerCase();
        
      
        this.filteredPieceList = this.pieceList.filter(piece =>
          (piece.code_piece.toString().toLowerCase().includes(lowerCaseTerm)) ||
          (piece.libelle.toLowerCase().includes(lowerCaseTerm)) ||
          (piece.type.toString().toLowerCase().includes(lowerCaseTerm))
        );
      
        // Reset the search input field
        (document.getElementById('search-input') as HTMLInputElement).value = '';
      
        console.log('Filtered PieceList:', this.filteredPieceList);
      }
      
      
        sort(column: keyof Piece): void {
          if (this.sortColumn === column) {
      
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
          } else {
      
            this.sortColumn = column;
            this.sortDirection = 'asc';
          }
        
          this.filteredPieceList = this.filteredPieceList.sort((a, b) => {
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