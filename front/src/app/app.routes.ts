import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ExpertiseComponent } from './components/expertise/expertise.component';
import { ImputationComponent } from './components/imputation/imputation.component';
import { UserComponent } from './components/users/users.component';
import { PieceComponent } from './components/piece/piece.component';
import { AppareilComponent } from './components/appareil/appareil.component';
import { AuthGuard } from './services/auth.guard';


export const routes: Routes = [
    { path: '',title:"Login", component: LoginComponent },
    { path: 'expertises',title:"Expertises", component: ExpertiseComponent , canActivate: [AuthGuard]},//guard to check if token is in localstorage
    { path: 'imputations',title:"Imputation", component: ImputationComponent , canActivate: [AuthGuard] },
    { path: 'utilisateurs',title:"Utilisateurs", component: UserComponent  , canActivate: [AuthGuard]},
    { path: 'pieces',title:"Pieces", component: PieceComponent  , canActivate: [AuthGuard]},
    { path: 'appareils',title:"Appareils", component: AppareilComponent  , canActivate: [AuthGuard]},
    
];
