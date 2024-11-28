import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-content',
  template: `
    <h2 mat-dialog-title>Item Details</h2>
    <mat-dialog-content>
      <p><strong>Name:</strong> {{ data.Name }}</p>
      <p><strong>Input:</strong> {{ data.Input }}</p>
      <p><strong>API:</strong> {{ data.API }}</p>
      <p><strong>Value:</strong> {{ data.Value }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class ModalContentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
