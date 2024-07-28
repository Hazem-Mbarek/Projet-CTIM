import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConnectionService } from '../../services/connection.service';
import { Imputation } from '../../models/imputations';

@Component({
  selector: 'app-imputation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './imputation.component.html',
  styleUrls: ['./imputation.component.scss']
})
export class ImputationComponent implements OnInit {
  filteredImputationList: Imputation[] = [];
  imputationList: Imputation[] = [];
  sortColumn: keyof Imputation | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  urValues: number[] = [];
  selectedCategory: number | null = null;

  constructor(private connectionservice: ConnectionService) {}

  ngOnInit(): void {
    this.fetchImputation();
    this.fetchUniqueURValues();
  }

  fetchImputation(): void {
    this.connectionservice.getImputation().subscribe({
      next: data => {
        this.imputationList = Array.isArray(data) ? data : [];
        this.filteredImputationList = [...this.imputationList];
        console.log('Fetched imputationList:', this.imputationList);
        this.search(''); // Apply initial search
      },
      error: error => console.error('Error fetching imputation data:', error)
    });
  }

  fetchUniqueURValues(): void {
    this.connectionservice.getImputationsUR().subscribe({
      next: data => {
        this.urValues = Array.isArray(data) ? Array.from(new Set(data.map((item: { UR: number }) => item.UR))) : [];
        console.log('Fetched unique UR values:', this.urValues);
      },
      error: error => console.error('Error fetching unique UR values:', error)
    });
  }

  search(searchTerm: string): void {
    const lowerCaseTerm = searchTerm.toLowerCase();

    console.log('Search term:', searchTerm);
    console.log('Selected category:', this.selectedCategory);

    this.filteredImputationList = this.imputationList.filter(imputation =>
        // for UR 
      imputation.UR==(this.selectedCategory)&&
      (
       imputation.section.toString().toLowerCase().includes(lowerCaseTerm) ||
       imputation.libelle.toLowerCase().includes(lowerCaseTerm))
    );

    console.log('Filtered imputationList:', this.filteredImputationList);
  }

  onCategoryChange(category: number | null): void {
    this.selectedCategory = category;
    this.search((document.getElementById('search-input') as HTMLInputElement).value);
  }

  onSearchInputChange(searchTerm: string): void {
    this.search(searchTerm);
  }

  sort(column: keyof Imputation): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filteredImputationList.sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  signout(): void {
    this.connectionservice.signout().subscribe({
      next: () => { console.log('User signed out');
        localStorage.removeItem('token');
        window.location.href = 'http://localhost:4200';
        if (localStorage.getItem('token') === null) {
          console.log('Token removed successfully');
        } else {
          console.log('Failed to remove token');
        }
       },
      error: error => { console.error('Error signing out:', error); }
    });
  }
}
