import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ModalContentComponent } from '../modal-content/modal-content.component';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tracking-screen',
  templateUrl: './tracking-screen.component.html',
  styleUrls: ['./tracking-screen.component.scss']
})
export class TrackingScreenComponent implements OnInit {
  
  constructor(public dialog: MatDialog,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {

  }

  trackerHeader: any [] = [];
  // data: any [] = []; 

  
  data: any = {
    MPO: {
      Process: [
        {
          Title: 'MMD Reco',
          Owner: 'IPC Officer',
          Viewer: 'Everyone',
          Items: [
            { Name: 'MPO Num', Input: '67890', API: 'MPO_API_2', Value: '11223' },
            { Name: 'MPO Date', Input: '2024-11-12', API: 'Date_API_2', Value: '2024-11-12' },
            { Name: 'Vendor Name', Input: 'Tech Solutions', API: 'Vendor_API_2', Value: 'Tech456' },
            { Name: 'Item Name', Input: 'Item ABC', API: 'Item_API_2', Value: 'Item456' },
            { Name: 'MPO Qty', Input: '200', API: 'Quantity_API_2', Value: '200' }
          ]
        },
        {
          Title: 'RFQ Approval',
          Owner: 'MMD Head',
          Viewer: 'Everyone',
          Items: [
              { Name: 'MPO Num', Input: '67890', API: 'MPO_API_2', Value: '11223' },
              { Name: 'MPO Date', Input: '2024-11-12', API: 'Date_API_2', Value: '2024-11-12' },
              { Name: 'Vendor Name', Input: 'Tech Solutions', API: 'Vendor_API_2', Value: 'Tech456' },
              { Name: 'Item Name', Input: 'Item ABC', API: 'Item_API_2', Value: 'Item456' },
              { Name: 'MPO Qty', Input: '200', API: 'Quantity_API_2', Value: '200' }
          ]
        },
        {
          Title: 'RFQ Sending',
          Owner: 'MMD Head',
          Viewer: 'Everyone',
          Items: [
            { Name: 'MPO Num', Input: '67890', API: 'MPO_API_2', Value: '11223' },
            { Name: 'MPO Date', Input: '2024-11-12', API: 'Date_API_2', Value: '2024-11-12' },
            { Name: 'Vendor Name', Input: 'Tech Solutions', API: 'Vendor_API_2', Value: 'Tech456' },
            { Name: 'Item Name', Input: 'Item ABC', API: 'Item_API_2', Value: 'Item456' },
            { Name: 'MPO Qty', Input: '200', API: 'Quantity_API_2', Value: '200' }
          ]
        },
        {
          Title: 'MMD Approval',
          Owner: 'MMD Head',
          Viewer: 'Everyone',
          Items: [
            { Name: 'MPO Num', Input: '67890', API: 'MPO_API_2', Value: '11223' },
            { Name: 'MPO Date', Input: '2024-11-12', API: 'Date_API_2', Value: '2024-11-12' },
            { Name: 'Vendor Name', Input: 'Tech Solutions', API: 'Vendor_API_2', Value: 'Tech456' },
            { Name: 'Item Name', Input: 'Item ABC', API: 'Item_API_2', Value: 'Item456' },
            { Name: 'MPO Qty', Input: '200', API: 'Quantity_API_2', Value: '200' }
          ]
        },
        {
          Title: 'MPO Confirmation',
          Owner: 'MMD Head',
          Viewer: 'Everyone',
          Items: [
            { Name: 'MPO Num', Input: '67890', API: 'MPO_API_2', Value: '11223' },
            { Name: 'MPO Date', Input: '2024-11-12', API: 'Date_API_2', Value: '2024-11-12' },
            { Name: 'Vendor Name', Input: 'Tech Solutions', API: 'Vendor_API_2', Value: 'Tech456' },
            { Name: 'Item Name', Input: 'Item ABC', API: 'Item_API_2', Value: 'Item456' },
            { Name: 'MPO Qty', Input: '200', API: 'Quantity_API_2', Value: '200' }
          ]
        }
      ]
    }
  };
 
  
  ngOnInit(): void {
    this.getProcesses();
  }

  getProcesses() {
    this.firestore
      .collection('AppProcesses')
      .valueChanges()
      .subscribe((response) => {
        this.trackerHeader = response;
        console.log('Fetched Data:', response);
      });

      this.firestore
      .collection('MPO_Data')
      .valueChanges()
      .subscribe((response) => {
        // this.data = response;
        console.log('Fetched Data:', response);
      });

    // const firestore = this.firestore.firestore; // This gives you access to the Firestore SDK

    // const batchSize = 500;
    // const batches = Array.from({ length: Math.ceil(this.jsonData.length / batchSize) }, (_, i) => {
    //   const batch = firestore.batch();
    //   this.jsonData.slice(i * batchSize, (i + 1) * batchSize).forEach(item => {
    //     const docRef = firestore.collection('MPO_Data').doc();
    //     batch.set(docRef, item);
    //   });
    //   return batch;
    // });

    // // Commit all batches
    // Promise.all(batches.map(batch => batch.commit()))
    //   .then(() => {
    //     console.log('All batches committed successfully!');
    //   })
    //   .catch((error) => {
    //     console.error('Error committing batches: ', error);
    //   });
  }

  login() {
    this.afAuth.signInWithEmailAndPassword("codinggoodies@gmail.com", "Coding@123!")
      .then(userCredential => {
        console.log('User logged in:', userCredential.user);
        // this.router.navigate(['/dashboard']); // Redirect to dashboard or another page
      })
      .catch(error => {
        console.error('Error during login:', error);
      });
  }

  getBodyItems(process: any) {
    return process.Items || [];
  } 

  // Handles the drop event
  onDrop(event: CdkDragDrop<any[]>, currentIndex: number) {
    if (event.previousContainer === event.container) {
      // If the drop is within the same column, reorder items
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (event.previousContainer.id === 'list-' + (currentIndex - 1)) {
      // Only allow transfer from the previous column to the current column
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  openModal(item: any): void {
    this.dialog.open(ModalContentComponent, {
      width: '400px',
      data: item
    });
  }
}
