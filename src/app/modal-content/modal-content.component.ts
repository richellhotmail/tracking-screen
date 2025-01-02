import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-content',
  template: `
    <h2 mat-dialog-title>Item Details</h2>
    
    <mat-dialog-content>
      <div><strong>Customer Code:</strong> {{ data.customerCode }}</div>
      <div><strong>First Name:</strong> {{ data.firstName }}</div>
      <div><strong>Last Name:</strong> {{ data.lastName }}</div>
      <div><strong>Logistic Route:</strong> {{ data.logisticRoute }}</div>
      <div><strong>Sales Route:</strong> {{ data.salesRoute }}</div>
      <div><strong>Sales Type:</strong> {{ data.salesType }}</div>
      <div><strong>SI Number:</strong> {{ data.siNumber }}</div>
      <div><strong>SI Date:</strong> {{ data.siDate }}</div>
      <div><strong>SO Date:</strong> {{ data.soDate }}</div>
      <div><strong>SO Number:</strong> {{ data.soNumber }}</div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class ModalContentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
