import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrackingScreenComponent } from './tracking-screen/tracking-screen.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // For buttons in the modal
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { OrderByPipe } from './pipe/order-by.pipe';
@NgModule({
  declarations: [
    AppComponent,
    TrackingScreenComponent,
    ModalContentComponent,
    OrderByPipe
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // Initialization logic can go here if needed.
  }
}
