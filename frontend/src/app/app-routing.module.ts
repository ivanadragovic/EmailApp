import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginregisterGuard } from './guards/loginregister.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {path:'', redirectTo:"/Dashboard", pathMatch:'full'},
  {path:"Dashboard", component:DashboardComponent, canActivate:[AuthGuard]},
  {path:"Login-Register", component:LoginRegisterComponent, canActivate:[LoginregisterGuard]},
  {path:"**", component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
