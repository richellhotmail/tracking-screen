import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrackingScreenComponent } from './components/tracking-screen/tracking-screen.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // For buttons in the modal
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { OrderByPipe } from './pipe/order-by.pipe';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { RouterModule } from '@angular/router';
import { FilterDataPipe } from './pipe/search-by.pipe';
@NgModule({
  declarations: [
    AppComponent,
    TrackingScreenComponent,
    ModalContentComponent,
    OrderByPipe,
    LoginComponent,
    FilterDataPipe
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    BrowserAnimationsModule,
    // Use compat module to initialize Firebase
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      // Other routes
    ])
  ],
  exports: [LoginComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // Initialization logic can go here if needed.
  }
}
