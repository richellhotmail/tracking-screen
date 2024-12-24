import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { ModalContentComponent } from '../../modal-content/modal-content.component';

@Component({
  selector: 'app-tracking-screen',
  templateUrl: './tracking-screen.component.html',
  styleUrls: ['./tracking-screen.component.scss']
})
export class TrackingScreenComponent implements OnInit {
  username: string = ''; // Ensure this is declared properly
  trackerHeader: any[] = [];
  data: any[] = [];

  constructor(public dialog: MatDialog,
              private firestore: AngularFirestore,
              private afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    this.getProcesses();
    // this.batchInsert();
    // this.batchInsert2();

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
    interface SalesData {
      customerCode: string;
      firstName: string;
      lastName: string;
      logisticRoute: string;
      salesRoute: string;
      salesType: string;
      siDate: string; // ISO string format
      siNumber: string; // 6-digit number as string
      soDate: string; // ISO string format
      soNumber: string; // 6-digit number as string
      status: string; // Restricted to provided values
      id?: string; // Optional field for auto-generated ID
    }
  
    const getRandomElement = (array: string[]): string => array[Math.floor(Math.random() * array.length)];
    const getRandom6DigitNumber = (): string => Math.floor(100000 + Math.random() * 900000).toString();
  
    // Generate 30 random records
    const jsonData: SalesData[] = Array.from({ length: 30 }, () => ({
      customerCode: Math.random().toString(36).substring(2, 7).toUpperCase(), // Random 5-character alphanumeric string
      firstName: getRandomElement(['John', 'Jane', 'Alice', 'Bob', 'Chris', 'Eve', 'Tom']),
      lastName: getRandomElement(['Doe', 'Smith', 'Johnson', 'Brown', 'Davis', 'Garcia', 'Martinez']),
      logisticRoute: getRandomElement(['NCR', 'Outside NCR']),
      salesRoute: `Sales Route ${getRandomElement(['A', 'B', 'C', 'D'])}`,
      salesType: getRandomElement(['b2b', 'b2c', 'c2c']),
      siDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date within the last 30 days
      siNumber: getRandom6DigitNumber(),
      soDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(), // Random date within the last 60 days
      soNumber: getRandom6DigitNumber(),
      status: getRandomElement(['New', 'Success', 'In-transit', 'Pending']),
    }));
  
    const firestore = this.firestore.firestore; // Access Firestore SDK
    const batchSize = 500; // Firestore supports batches of up to 500 writes
    const collectionRef = firestore.collection('SO_Data'); // Target the Sales collection
  
    // Process data in batches
    const batches = Array.from({ length: Math.ceil(jsonData.length / batchSize) }, (_, i) => {
      const batch = firestore.batch();
      jsonData.slice(i * batchSize, (i + 1) * batchSize).forEach(item => {
        const docRef = collectionRef.doc(); // Generate a new document ID
        item.id = docRef.id; // Set the auto-generated ID
        batch.set(docRef, item); // Add the document to the batch
      });
      return batch;
    });
  
    // Commit all batches
    Promise.all(batches.map(batch => batch.commit()))
      .then(() => console.log('Batch insert successful'))
      .catch(error => console.error('Batch insert failed:', error));
  }
  
  batchInsert2() {
    
    interface UserData {
      applications: string[];
      dateCreated: string; // ISO string format
      groups: string[];
      password: string;
      username: string;
      id?: string; // Optional id field
    }
  
    const jsonData: UserData[] = [
      {
        applications: ['MPO', 'SO'],
        dateCreated: '2024-12-12T00:00:00Z',
        groups: ['G_MPO', 'G_SO'],
        password: 'admin',
        username: 'admin'
      },
      // Add more user data objects as required
      {
        applications: ['SO'],
        dateCreated: '2024-12-23T00:00:00Z',
        groups: ['G_SO'],
        password: 'soworker',
        username: 'soworker'
      },
      {
        applications: ['MPO'],
        dateCreated: '2024-12-19T00:00:00Z',
        groups: ['G_MPO'],
        password: 'mpoworker',
        username: 'mpoworker'
      }
    ];
  
    const firestore = this.firestore.firestore; // Access Firestore SDK
    const batchSize = 500; // Firestore supports batches of up to 500 writes
    const collectionRef = firestore.collection('Users'); // Target the Users collection
  
    // Process data in batches
    const batches = Array.from({ length: Math.ceil(jsonData.length / batchSize) }, (_, i) => {
      const batch = firestore.batch();
      jsonData.slice(i * batchSize, (i + 1) * batchSize).forEach(item => {
        const docRef = collectionRef.doc(); // Generate a new document ID
        item.id = docRef.id; // Set the auto-generated ID
        batch.set(docRef, item); // Add the document to the batch
      });
      return batch;
    });
  
    // Commit all batches
    Promise.all(batches.map(batch => batch.commit()))
      .then(() => console.log('Batch insert successful'))
      .catch(error => console.error('Batch insert failed:', error));
  }
  
}
