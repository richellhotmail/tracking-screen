import { Component, OnInit } from '@angular/core';
// import { FirebaseService } from './services/firebase/firebase.service'; // import the service

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    // You can access Firebase functionality here if needed
  }
}
