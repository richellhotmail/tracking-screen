import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { ModalContentComponent } from '../../modal-content/modal-content.component';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tracking-screen',
  templateUrl: './tracking-screen.component.html',
  styleUrls: ['./tracking-screen.component.scss']
})
export class TrackingScreenComponent implements OnInit {
  private trackerHeaderSubscription: any;
  private dataSubscription: any;
  username: string = ''; // Ensure this is declared properly
  trackerHeader: any[] = [];
  data: any[] = [];
  filteredHeader: any[] = [];  // Store filtered AppName-specific header
  selectedAppName: string = '';  // Default app selection
  assignedApplications: any[] = [];
  searchTerm: string = ''; // This property holds the search term

  constructor(public dialog: MatDialog,
              private firestore: AngularFirestore,
              private afAuth: AngularFireAuth,
              private router: Router ) {}

  ngOnInit(): void {
    this.getProcesses();
    this.checkLogin();
    // this.batchDelete();
    // this.batchInsertProcesses();
    // this.batchInsert();
    // this.batchInsert2();
  }

  checkLogin() {
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      console.log('Logged in user:', parsedUser);
      this.assignedApplications = parsedUser.applications;
    } else {
      console.log('No user logged in');
    }
  }

  onLogout() {
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
    // this.addBatchRecords();
  }

  ngOnDestroy() {
    if (this.trackerHeaderSubscription) {
      this.trackerHeaderSubscription.unsubscribe();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
  
  getProcesses() {
    this.firestore
      .collection('AppProcesses')
      .valueChanges()
      .subscribe((response) => {
        this.trackerHeader = response;
        this.filterHeaderByAppName(); // Initially filter by the default AppName
        console.log('Fetched Tracker Header:', response);
      });
    }

    filterHeaderByAppName() {
      // Filter processes by selected AppName
      console.log("this.trackerHeader ", this.trackerHeader)
      this.filteredHeader = this.trackerHeader.filter(item => item.AppName == this.selectedAppName || item.appName == this.selectedAppName);
      console.log('Filtered Header:', this.filteredHeader);
    }

    // Handle the process status dropdown or other selection change
    onAppNameChange(newAppName: string) {
      this.selectedAppName = newAppName;
      console.log('App Name:', this.selectedAppName);
      this.filterHeaderByAppName();  // Re-filter when AppName changes
      if (newAppName == 'MPO') {
        this.firestore
        .collection('MPO_Data')
        .valueChanges()
        .subscribe((response) => {
          this.data = response;
          console.log('Fetched Data:', response);
        });
      } else if (newAppName == 'IOCD') {
        this.firestore
        .collection('SO_Data')
        .valueChanges()
        .subscribe((response) => {
          this.data = response;
          console.log('Fetched Data:', response);
        });
      }
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
  addBatchRecords() {
    const firestore = this.firestore.firestore;
    const statuses = ['q', 'w', 'e', 'r', 't', 'y', 'u']; // Updated statuses
    const salesTypes = ['retail', 'b2b', 'b2c'];
  
    const soDataCollection = firestore.collection('SO_Data');
  
    // Pre-fetch all existing soNumbers (if required, you can uncomment the related code)
    soDataCollection.get()
      .then(snapshot => {
        const batch = firestore.batch();
  
        for (let i = 0; i < 30; i++) {
          const soNumber = (Math.floor(Math.random() * 100000) + 1).toString();
  
          // Generate unique ID
          const id = uuidv4();
          const record = {
            customerCode: `CUST${i + 1}`,
            firstName: `FirstName${i + 1}`,
            lastName: `LastName${i + 1}`,
            logisticRoute: `Route${i + 1}`,
            salesRoute: `Sales Route ${i + 1}`,
            salesType: salesTypes[Math.floor(Math.random() * salesTypes.length)],
            siDate: new Date().toISOString(),
            siNumber: (Math.floor(Math.random() * 100000) + 1).toString(),
            soDate: new Date().toISOString(),
            soNumber, // Use the generated soNumber
            status: statuses[Math.floor(Math.random() * statuses.length)], // Assign random status
          };
  
          const docRef = soDataCollection.doc(id);
          batch.set(docRef, record);
        }
  
        // Commit the batch
        return batch.commit();
      })
      .then(() => {
        console.log('Batch insert completed successfully.');
      })
      .catch(error => {
        console.error('Error during batch insertion:', error);
      });
  }
  

  batchDelete() {
    const firestore = this.firestore.firestore; // Access Firestore SDK
    const batchSize = 700; // Firestore supports batches of up to 500 writes
    const collectionRef = firestore.collection('SO_Data'); // Target the Process collection
    
    // Query to get all documents where appName is 'IOCD'
    const query = collectionRef;
    // Get the documents in batches
    query.get().then(snapshot => {
      const batches = Array.from({ length: Math.ceil(snapshot.size / batchSize) }, (_, i) => {
        const batch = firestore.batch();
        snapshot.docs.slice(i * batchSize, (i + 1) * batchSize).forEach(doc => {
          batch.delete(doc.ref); // Mark the document for deletion
        });
        return batch;
      });
  
      // Commit each batch of deletions
      batches.forEach(batch => batch.commit());
    }).catch(error => {
      console.error("Error deleting documents: ", error);
    });
  }
  deleteDuplicates() {
    const firestore = this.firestore.firestore; // Access Firestore SDK
    const batchSize = 500; // Firestore supports batches of up to 500 writes
    const collectionRef = firestore.collection('SO_Data'); // Target the SO_Data collection
  
    // Query to get all documents
    collectionRef.get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("No documents found.");
          return;
        }
  
        // Group documents by duplicate criteria (excluding 'id')
        const groupedDocs: { [key: string]: any[] } = {};
        snapshot.docs.forEach(doc => {
          const data:any = doc.data();
  
          // Create a unique key for each group based on all fields except 'id'
          const groupKey = JSON.stringify({
            customerCode: data.customerCode,
            firstName: data.firstName,
            lastName: data.lastName,
            logisticRoute: data.logisticRoute,
            salesRoute: data.salesRoute,
            salesType: data.salesType,
            siDate: data.siDate,
            siNumber: data.siNumber,
            soDate: data.soDate,
            soNumber: data.soNumber,
            status: data.status,
          });
  
          if (!groupedDocs[groupKey]) {
            groupedDocs[groupKey] = [];
          }
          groupedDocs[groupKey].push({ ...data, ref: doc.ref });
        });
  
        // Identify documents to delete
        const docsToDelete: any[] = [];
        Object.values(groupedDocs).forEach((docs: any[]) => {
          if (docs.length > 1) {
            // Sort documents by 'soDate' in descending order
            docs.sort((a, b) => new Date(b.soDate).getTime() - new Date(a.soDate).getTime());
            // Keep the first document (latest) and mark the rest for deletion
            docsToDelete.push(...docs.slice(1).map(doc => doc.ref));
          }
        });
  
        // Delete documents in batches
        const batches = Array.from(
          { length: Math.ceil(docsToDelete.length / batchSize) },
          (_, i) => {
            const batch = firestore.batch();
            docsToDelete.slice(i * batchSize, (i + 1) * batchSize).forEach(ref => {
              batch.delete(ref);
            });
            return batch;
          }
        );
  
        // Commit each batch
        return Promise.all(batches.map(batch => batch.commit()));
      })
      .then(() => {
        console.log("Duplicate documents deleted successfully.");
      })
      .catch(error => {
        console.error("Error deleting documents: ", error);
      });
  }
  
}
