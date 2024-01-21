import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';
import { LoansComponent } from './loans/loans.component';
import { DebtsComponent } from './debts/debts.component';
import { PasswordsComponent } from './passwords/passwords.component';
import { TasksComponent } from './tasks/tasks.component';
import { HomeComponent } from './home';

const routes: Routes = [
    //{ path: '', component: TasksComponent, canActivate: [AuthGuard] },
    { path: '', component: TasksComponent },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'loans', component: LoansComponent },
    { path: 'debts', component: DebtsComponent },
    { path: 'password', component: PasswordsComponent },
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);