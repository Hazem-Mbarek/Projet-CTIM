import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Expertise } from '../../models/expertise';
import { Travail } from '../../models/travail';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../auth/interceptor';

@Component({
  selector: 'app-expertise',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './expertise.component.html',
  styleUrls: ['./expertise.component.scss'],
  providers: [DatePipe] 
})
export class ExpertiseComponent  implements OnInit{
constructor(
  private connectionservice:ConnectionService,
  private datePipe: DatePipe 
){}
view: string = 'A'; 
filteredExpertiseList: Expertise[] = [];
currentExpertise: Expertise | null = null;
expertiseList: Expertise[] = [];
lastExpertiseNumExp: number | undefined;
selectedExpertiseNumExp: number | undefined;
errorMessage: string | null = null;

travailList: Travail[] = [];
filteredTravailList: Travail[] = [];
currentTravail: Travail | null = null;

sortColumn: string = ''; 
sortDirection: 'asc' | 'desc' = 'asc';
newExpertise: Expertise = {
  num_exp: 0,
  date_exp: '',
  num_dps: 0,
  date_dps: '',
  UR: 0,
  section: 0,
  state:"en attente"
};

newTravail: Travail = {
  num_exp:0,
  code_app: "",
  code_piece:"" ,
  qte: 0
};
selectedCodeApp: string | undefined;

ngOnInit(): void {
  this.fetchExpertises();
  }

  selectedTravailHistory: Travail[] = [];



  openDialog(travail: Travail): void {
    this.selectedCodeApp = travail.code_app;
    this.connectionservice.getAppHistory(travail.code_app).subscribe(history => {
      this.selectedTravailHistory = history;
      const dialog: HTMLDialogElement | null = document.querySelector('#detailDialog');
      if (dialog) {
        dialog.showModal();
      }
    });
  }

  closeDialog(): void {
    const dialog: HTMLDialogElement | null = document.querySelector('#detailDialog');
    if (dialog) {
      dialog.close();
    }
  }
  
  deleteTravail(selectedExpertiseNumExp: number | undefined,code_app:string,code_piece:string): void {
    if (selectedExpertiseNumExp === undefined) {
      console.error('No travail number provided for deletion');
      return;
    }
    this.connectionservice.deleteTravail(selectedExpertiseNumExp,code_app,code_piece).subscribe({
      next: () => {
        this.fetchExpertises();
      },
      error: error => {
        console.error('Error deleting Travail:', error);
      }
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

  editExpertise(expertise: Expertise): void {
    this.newExpertise = { ...expertise }; 
    this.view = 'C'; 
  }

  editTravail(travail: Travail): void {
    this.newTravail = { 
      ...travail, 
      num_exp: this.selectedExpertiseNumExp || 0 
    };
    console.log(this.newTravail);
    this.view = 'E';
  }


  updateExpertise(): void {
    if (!this.newExpertise.num_exp) {
      console.error('No expertise selected for updating');
      return;
    }

    this.connectionservice.updateExpertise(this.newExpertise).subscribe({
      next: () => {
        this.fetchExpertises();
        this.view = 'A'; 
      },
      error: error => {
        console.error('Error updating expertise:', error);
      }
    });
  }


  updateTravail(): void {
    if (!this.newTravail.code_app) {
      console.error('No travail selected for updating');
      return;
    }

    this.connectionservice.updateTravail(this.newTravail).subscribe({
      next: () => {
        this.fetchTravaux(this.newTravail.num_exp);
        this.view = 'D'; 
      },
      error: error => {
        console.error('Error updating travail:', error);
      }
    });
  }
  
  cancelEdit(): void {
    this.view = 'A'; 
    this.newExpertise = {
      num_exp: 0,
      date_exp: '',
      num_dps: 0,
      date_dps: '',
      UR: 0,
      section: 0,
      state:"en attente"
    };
  }

  cancelEditTravail(): void {
    this.view = 'D'; 
  
this.newTravail = {
  num_exp:0,
  code_app: "",
  code_piece:"" ,
  qte: 0
};
  }



  PDF(num_exp: number| undefined): void {
     if (num_exp === undefined) {
      console.error('No expertise number provided for deletion');
      return;
    }
    this.connectionservice.getPdf(num_exp).subscribe({
      next: (pdfBlob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `file_${num_exp}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        console.log('PDF download success');
      },
      error: (error) => {
        console.error('Error fetching PDF:', error);
      }
    });
  }


  deleteExpertise(num_exp: number | undefined): void {
    if (num_exp === undefined) {
      console.error('No expertise number provided for deletion');
      return;
    }
    this.connectionservice.deleteExpertise(num_exp).subscribe({
      next: () => {
        this.fetchExpertises();
      },
      error: error => {
        console.error('Error deleting expertise:', error);
      }
    });
  }

  

  addExpertise(): void {
    // Prepare the expertise data without num_exp
    const expertiseToAdd: Omit<Expertise, 'num_exp'> = {
      date_exp: this.newExpertise.date_exp,
      num_dps: this.newExpertise.num_dps,
      date_dps: this.newExpertise.date_dps,
      UR: this.newExpertise.UR,
      section: this.newExpertise.section,
      state: this.newExpertise.state
    };

    this.connectionservice.addExpertise(expertiseToAdd).subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length > 0) {
          this.lastExpertiseNumExp = response[0].num_exp;
        } else {
          console.error('Unexpected response format:', response);
        }

        this.fetchExpertises();
        console.log('Last Expertise num_exp:', this.lastExpertiseNumExp);

        this.view = 'b';
        this.errorMessage = null;  
      },
      error: (error) => {
        console.error('Error adding expertise:', error);
        this.errorMessage = 'An error occurred while adding expertise. Please try again.';
      }
    });
  }


addTravail(): void {
  if (this.lastExpertiseNumExp === undefined) {
    console.error('No expertise available to add travail');
    return;
  }
  const travailToAdd: Travail = {
    num_exp: this.lastExpertiseNumExp, 
    code_app: this.newTravail.code_app,
    code_piece: this.newTravail.code_piece,
    qte: this.newTravail.qte
  };

  this.connectionservice.addTravail(travailToAdd).subscribe(() => {
    console.log('Travail added successfully');
  });
}

addTravailseperate(): void {
  if (this.selectedExpertiseNumExp === undefined) {
    console.error('No expertise available to add travail');
    return;
  }
  const travailToAdd: Travail = {
    num_exp: this.selectedExpertiseNumExp, 
    code_app: this.newTravail.code_app,
    code_piece: this.newTravail.code_piece,
    qte: this.newTravail.qte
  };

  this.connectionservice.addTravail(travailToAdd).subscribe(() => {
    console.log('Travail added successfully');
  });
}


async fetchExpertises(): Promise<void> {
  
  try {
    
    const data = await this.connectionservice.getExpertise().toPromise();
     console.log("data:",data);
     
    this.expertiseList = Array.isArray(data) ? data : [];
    this.expertiseList.forEach(expertise => {
      expertise.date_exp = this.formatDate(expertise.date_exp);
      expertise.date_dps = this.formatDate(expertise.date_dps);
    });

    this.filteredExpertiseList = [...this.expertiseList];

    //this.lastExpertiseNumExp = this.filteredExpertiseList[this.filteredExpertiseList.length - 1]?.num_exp;
    console.log('Filtered expertise list:', this.filteredExpertiseList);
  } catch (error) {
    console.error('Error fetching expertises:', error);
  }
}


fetchTravaux(num_exp: number | undefined): void {
  this.view='D'
  if (num_exp !== undefined) {
    this.connectionservice.getTravail(num_exp.toString()).subscribe(data => {
      this.travailList = Array.isArray(data) ? data : [];
      this.filteredTravailList = [...this.travailList];
      console.log(this.filteredTravailList);
      this.selectedExpertiseNumExp=num_exp;
    });
  } else {
    console.error('num_exp is undefined');
  }
}



formatDate(dateString: string): string {
  return this.datePipe.transform(dateString, 'dd MMM yyyy') || '';
}

search(searchTerm: string): void {
  const lowerCaseTerm = searchTerm.toLowerCase();
  

  this.filteredExpertiseList = this.expertiseList.filter(expertise =>
    (expertise.num_exp?.toString().toLowerCase().includes(lowerCaseTerm) ?? false) ||
    (expertise.date_exp.toLowerCase().includes(lowerCaseTerm)) ||
    (expertise.num_dps.toString().toLowerCase().includes(lowerCaseTerm)) ||
    (expertise.date_dps.toLowerCase().includes(lowerCaseTerm)) ||
    (expertise.UR.toString().toLowerCase().includes(lowerCaseTerm)) ||
    (expertise.section.toString().toLowerCase().includes(lowerCaseTerm))
  );

  // Reset the search input field
  (document.getElementById('search-input') as HTMLInputElement).value = '';

  console.log('Filtered expertiseList:', this.filteredExpertiseList);
}


  sort(column: keyof Expertise): void {
    if (this.sortColumn === column) {

      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {

      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  
    this.filteredExpertiseList = this.filteredExpertiseList.sort((a, b) => {
      let valueA: any = a[column];
      let valueB: any = b[column];
  
      if (column === 'date_exp' || column === 'date_dps') {

        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }
  
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  searchTrav(searchTerm: string): void {

    const lowerCaseTerm = searchTerm.toLowerCase();
    

    this.filteredTravailList = this.travailList.filter(travail =>
      (travail.code_app.toLowerCase().includes(lowerCaseTerm) ?? false) ||
      (travail.code_piece.toLowerCase().includes(lowerCaseTerm)) ||
      (travail.qte.toString().toLowerCase().includes(lowerCaseTerm))
    );
  
    (document.getElementById('search-input') as HTMLInputElement).value = '';
  
    console.log('Filtered expertiseList:', this.filteredExpertiseList);
  }
  
  
    sortTrav(column: keyof Travail): void {
      if (this.sortColumn === column) {

        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {

        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
    
      this.filteredTravailList = this.filteredTravailList.sort((a, b) => {
        let valueA: any = a[column];
        let valueB: any = b[column];
    
  
    
        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    



}

     
/*confirmExpertise(num_exp: number | undefined):void{
  this.connectionservice.confirmExpertise(num_exp).subscribe({
    next: () => {
      this.fetchExpertises();
      this.view = 'A';
    },
    error: error => {
      console.error('Error confirming expertise:', error);
    }
  });
}*/