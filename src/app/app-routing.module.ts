import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackingScreenComponent } from './tracking-screen/tracking-screen.component';

const routes: Routes = [
  { path: 'my-component', component: TrackingScreenComponent },
  { path: '', redirectTo: '/my-component', pathMatch: 'full' }, // Optional default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
