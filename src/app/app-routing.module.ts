import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackingScreenComponent } from './components/tracking-screen/tracking-screen.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'my-component', component: TrackingScreenComponent },
  { path: 'login', component: LoginComponent },  // Add the login route
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Optional default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
