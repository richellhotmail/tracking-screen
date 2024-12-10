import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { ModalContentComponent } from '../modal-content/modal-content.component';

@Component({
  selector: 'app-tracking-screen',
  templateUrl: './tracking-screen.component.html',
  styleUrls: ['./tracking-screen.component.scss']
})
export class TrackingScreenComponent implements OnInit {

  trackerHeader: any[] = [];
  data: any[] = [];

  constructor(public dialog: MatDialog,
              private firestore: AngularFirestore,
              private afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    this.getProcesses();
    // this.batchInsert();
  }

  getProcesses() {
    this.firestore
      .collection('AppProcesses') // Replace with your document ID
      .valueChanges()
      .subscribe((response) => {
        this.trackerHeader = response;
        console.log('Fetched Tracker Header:', response);
      });

    this.firestore
      .collection('MPO_Data') // Replace with your document ID
      .valueChanges()
      .subscribe((response) => {
        this.data = response;
        console.log('Fetched Data:', response);
      });
  }

  getItemsByStatus(status: string) {
    return this.data.filter(item => item.status === status);
  }

  getConnectedList(sequence: number): string[] {
    const nextSequence = sequence + 1;
    return this.trackerHeader.filter(header => header.sequence === nextSequence).map(header => 'list-' + header.sequence);
  }

  onDrop(event: CdkDragDrop<any[]>, process: any) {
    if (event.previousContainer === event.container) {
      // Reorder items in the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Transfer items between columns and update status
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // Update the status of the item being moved
      const movedItem = event.container.data[event.currentIndex];
      movedItem.status = process.key; // Update item status to new process's key
      this.updateItemStatus(movedItem); // Update the item status in Firestore or local data
    }
  }
  updateItemStatus(item: any) {
    // Ensure the item has an id field
    if (!item.id) {
      console.error('Item must have an id field');
      return; // Exit if the item doesn't have an id field
    }
  
    // Find the item locally by mpoAmount (or any other unique field)
    const index = this.data.findIndex(d => d.mpoAmount === item.mpoAmount && d.id === item.id);
  
    if (index !== -1) {
      // Update the item status locally
      this.data[index] = item;
  
      // Update the specific fields in Firestore using update()
      this.firestore.collection('MPO_Data').doc(item.id).update({
        mpoDate: item.mpoDate,    // Update specific fields
        mpoAmount: item.mpoAmount,
        vendor: item.vendor,
        status: item.status
      })
      .then(() => {
        console.log(`Item with id ${item.id} updated successfully.`);
      })
      .catch((error) => {
        console.error('Error updating item in Firestore: ', error);
      });
    } else {
      console.error('Item not found or id mismatch');
    }
  }
  

  openModal(item: any): void {
    this.dialog.open(ModalContentComponent, {
      width: '400px',
      data: item
    });
  }

  
  batchInsert() {
    interface MPOData {
      mpoDate: string;
      mpoAmount: string;
      vendor: string;
      status: string;
      id?: string;  // Optional id field
    }
    const jsonData: MPOData[] = [
      { mpoDate: '11/23/2024', mpoAmount: '67890', vendor: 'Ayala', status: 'x' },
      { mpoDate: '11/24/2024', mpoAmount: '12345', vendor: 'Mendoza', status: 'y' },
      { mpoDate: '11/25/2024', mpoAmount: '23456', vendor: 'Santos', status: 'z' },
      { mpoDate: '11/26/2024', mpoAmount: '34567', vendor: 'Lopez', status: 'q' },
      { mpoDate: '11/27/2024', mpoAmount: '45678', vendor: 'Reyes', status: 'h' },
      { mpoDate: '11/28/2024', mpoAmount: '56789', vendor: 'Garcia', status: 'x' },
      { mpoDate: '11/29/2024', mpoAmount: '67890', vendor: 'Rodriguez', status: 'y' },
      { mpoDate: '11/30/2024', mpoAmount: '78901', vendor: 'Perez', status: 'z' },
      { mpoDate: '12/01/2024', mpoAmount: '89012', vendor: 'Gomez', status: 'q' },
      { mpoDate: '12/02/2024', mpoAmount: '90123', vendor: 'Martinez', status: 'h' },
      { mpoDate: '12/03/2024', mpoAmount: '12345', vendor: 'Diaz', status: 'x' },
      { mpoDate: '12/04/2024', mpoAmount: '23456', vendor: 'Castro', status: 'y' },
      { mpoDate: '12/05/2024', mpoAmount: '34567', vendor: 'Fernandez', status: 'z' },
      { mpoDate: '12/06/2024', mpoAmount: '45678', vendor: 'Vargas', status: 'q' },
      { mpoDate: '12/07/2024', mpoAmount: '56789', vendor: 'Torres', status: 'h' },
    ];
  
    const firestore = this.firestore.firestore; // This gives you access to the Firestore SDK
  
    const batchSize = 500;
    const batches = Array.from({ length: Math.ceil(jsonData.length / batchSize) }, (_, i) => {
      const batch = firestore.batch();
      jsonData.slice(i * batchSize, (i + 1) * batchSize).forEach(item => {
        const docRef = firestore.collection('MPO_Data').doc(); // Get a new document reference
        item.id = docRef.id; // Set the 'id' field to the document's auto-generated id
        batch.set(docRef, item); // Add the document to the batch
      });
      return batch;
    });
  
    // Commit all batches
    Promise.all(batches.map(batch => batch.commit()))
      .then(() => {
        console.log('All batches committed successfully!');
      })
      .catch((error) => {
        console.error('Error committing batches: ', error);
      });
  }  
}
