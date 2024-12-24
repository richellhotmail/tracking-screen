import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  
  constructor(private router: Router, private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    // Optional: Check if user is already logged in when the component loads
    const user = sessionStorage.getItem('user');
    if (user) {
      this.router.navigate(['/my-component']);  // Redirect if user is already logged in
    }
  }

  onLogin() {
    console.log('onLogin');
    if (!this.username || !this.password) {
      this.errorMessage = 'Username and password are required';
      return;
    }

    // Firestore query with AngularFire
    this.firestore
      .collection('Users', ref => ref.where('username', '==', this.username))
      .valueChanges()
      .subscribe({
        next: (response: any[]) => {
          if (response.length === 0) {
            this.errorMessage = 'Invalid username';
            return;
          }

          const user = response[0];
          if (user.password === this.password) {
            console.log('Login successful');
            this.storeUserData(user);
            this.router.navigate(['/my-component']);
          } else {
            this.errorMessage = 'Invalid password';
          }
        },
        error: (err) => {
          console.error('Error fetching user:', err);
          this.errorMessage = 'An error occurred during login';
        }
      });
  }

  storeUserData(user: any) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  checkLogin() {
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      console.log('Logged in user:', parsedUser);
    } else {
      console.log('No user logged in');
    }
  }

  onLogout() {
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
