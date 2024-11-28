import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ModalContentComponent } from '../modal-content/modal-content.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tracking-screen',
  templateUrl: './tracking-screen.component.html',
  styleUrls: ['./tracking-screen.component.scss']
})
export class TrackingScreenComponent {
  constructor(public dialog: MatDialog) {

  }
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
