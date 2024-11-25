import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tracking-screen',
  templateUrl: './tracking-screen.component.html',
  styleUrls: ['./tracking-screen.component.scss']
})
export class TrackingScreenComponent {
  data: any = {
    MPO: {
      Process: [
        {
          Title: 'MMD Reco',
          Owner: 'IPC Officer',
          Viewer: 'Everyone',
          Sections: [
            {
              Name: 'Header',
              Items: [
                { Name: 'KPI1', Input: '1', API: 'API1', Value: 'Value1' },
                { Name: 'KPI2', Input: 'Input2', API: 'API2', Value: 'Value2' },
                { Name: 'TC1', Input: 'Input3', API: 'API3', Value: 'Value3' },
                { Name: 'TC2', Input: 'Input4', API: 'API4', Value: 'Value4' }
              ]
            },
            {
              Name: 'Body',
              Items: [
                { Name: 'MPO Num', Input: '12345', API: 'MPO_API', Value: '56789' },
                { Name: 'MPO Date', Input: '2024-11-10', API: 'Date_API', Value: '2024-11-10' },
                { Name: 'Vendor Name', Input: 'Acme Corp', API: 'Vendor_API', Value: 'Acme123' },
                { Name: 'Item Name', Input: 'Item XYZ', API: 'Item_API', Value: 'Item123' },
                { Name: 'MPO Qty', Input: '100', API: 'Quantity_API', Value: '100' }
              ]
            },
            {
              Name: 'Footer',
              Items: [
                { Name: 'Rep1', Input: 'Report 1', API: 'Rep1_API', Value: 'Rep1_Value' },
                { Name: 'Rep2', Input: 'Report 2', API: 'Rep2_API', Value: 'Rep2_Value' }
              ]
            }
          ]
        },
        {
          Title: 'RFQ Approval',
          Owner: 'MMD Head',
          Viewer: 'Everyone',
          Sections: [
            {
              Name: 'Header',
              Items: [
                { Name: 'KPI1', Input: 'Input5', API: 'API5', Value: 'Value5' },
                { Name: 'KPI2', Input: 'Input6', API: 'API6', Value: 'Value6' },
                { Name: 'TC1', Input: 'Input7', API: 'API7', Value: 'Value7' },
                { Name: 'TC2', Input: 'Input8', API: 'API8', Value: 'Value8' }
              ]
            },
            {
              Name: 'Body',
              Items: [
                { Name: 'MPO Num', Input: '67890', API: 'MPO_API_2', Value: '11223' },
                { Name: 'MPO Date', Input: '2024-11-12', API: 'Date_API_2', Value: '2024-11-12' },
                { Name: 'Vendor Name', Input: 'Tech Solutions', API: 'Vendor_API_2', Value: 'Tech456' },
                { Name: 'Item Name', Input: 'Item ABC', API: 'Item_API_2', Value: 'Item456' },
                { Name: 'MPO Qty', Input: '200', API: 'Quantity_API_2', Value: '200' }
              ]
            },
            {
              Name: 'Footer',
              Items: [
                { Name: 'Rep1', Input: 'Report A', API: 'Rep1_API_2', Value: 'RepA_Value' },
                { Name: 'Rep2', Input: 'Report B', API: 'Rep2_API_2', Value: 'RepB_Value' }
              ]
            }
          ]
        },
        {
          Title: 'RFQ Sending',
          Owner: 'MMD Head',
          Viewer: 'Everyone',
          Sections: [
            {
              Name: 'Header',
              Items: [
                { Name: 'KPI1', Input: 'Input9', API: 'API9', Value: 'Value9' },
                { Name: 'KPI2', Input: 'Input10', API: 'API10', Value: 'Value10' },
                { Name: 'TC1', Input: 'Input11', API: 'API11', Value: 'Value11' },
                { Name: 'TC2', Input: 'Input12', API: 'API12', Value: 'Value12' }
              ]
            },
            {
              Name: 'Body',
              Items: [
                { Name: 'MPO Num', Input: '11223', API: 'MPO_API_3', Value: '33445' },
                { Name: 'MPO Date', Input: '2024-11-14', API: 'Date_API_3', Value: '2024-11-14' },
                { Name: 'Vendor Name', Input: 'Global Suppliers', API: 'Vendor_API_3', Value: 'Global789' },
                { Name: 'Item Name', Input: 'Item DEF', API: 'Item_API_3', Value: 'Item789' },
                { Name: 'MPO Qty', Input: '300', API: 'Quantity_API_3', Value: '300' }
              ]
            },
            {
              Name: 'Footer',
              Items: [
                { Name: 'Rep1', Input: 'Report X', API: 'Rep1_API_3', Value: 'RepX_Value' },
                { Name: 'Rep2', Input: 'Report Y', API: 'Rep2_API_3', Value: 'RepY_Value' }
              ]
            }
          ]
        },
        {
          Title: 'MMD Approval',
          Owner: 'MMD Head',
          Viewer: 'Everyone',
          Sections: [
            {
              Name: 'Header',
              Items: [
                { Name: 'KPI1', Input: 'Input13', API: 'API13', Value: 'Value13' },
                { Name: 'KPI2', Input: 'Input14', API: 'API14', Value: 'Value14' },
                { Name: 'TC1', Input: 'Input15', API: 'API15', Value: 'Value15' },
                { Name: 'TC2', Input: 'Input16', API: 'API16', Value: 'Value16' }
              ]
            },
            {
              Name: 'Body',
              Items: [
                { Name: 'MPO Num', Input: '33445', API: 'MPO_API_4', Value: '55667' },
                { Name: 'MPO Date', Input: '2024-11-16', API: 'Date_API_4', Value: '2024-11-16' },
                { Name: 'Vendor Name', Input: 'Prime Industries', API: 'Vendor_API_4', Value: 'Prime123' },
                { Name: 'Item Name', Input: 'Item GHI', API: 'Item_API_4', Value: 'Item123' },
                { Name: 'MPO Qty', Input: '400', API: 'Quantity_API_4', Value: '400' }
              ]
            },
            {
              Name: 'Footer',
              Items: [
                { Name: 'Rep1', Input: 'Report M', API: 'Rep1_API_4', Value: 'RepM_Value' },
                { Name: 'Rep2', Input: 'Report N', API: 'Rep2_API_4', Value: 'RepN_Value' }
              ]
            }
          ]
        },
        {
          Title: 'MPO Confirmation',
          Owner: 'MMD Head',
          Viewer: 'Everyone',
          Sections: [
            {
              Name: 'Header',
              Items: [
                { Name: 'KPI1', Input: 'Input17', API: '22API17', Value: 'Value17' },
                { Name: 'KPI2', Input: 'Input18', API: 'API18', Value: 'Value18' },
                { Name: 'TC1', Input: 'Input19', API: 'API19', Value: 'Value19' },
                { Name: 'TC2', Input: 'Input20', API: 'API20', Value: 'Value20' }
              ]
            },
            {
              Name: 'Body',
              Items: [
                { Name: 'MPO Num', Input: '55667', API: 'MPO_API_5', Value: '77889' },
                { Name: 'MPO Date', Input: '2024-11-18', API: 'Date_API_5', Value: '2024-11-18' },
                { Name: 'Vendor Name', Input: 'Eco Solutions', API: 'Vendor_API_5', Value: 'Eco101' },
                { Name: 'Item Name', Input: 'Item JKL', API: 'Item_API_5', Value: 'Item555' },
                { Name: 'MPO Qty', Input: '500', API: 'Quantity_API_5', Value: '500' }
              ]
            },
            {
              Name: 'Footer',
              Items: [
                { Name: 'Rep1', Input: 'Report Z', API: 'Rep1_API_5', Value: 'RepZ_Value' },
                { Name: 'Rep2', Input: 'Report W', API: 'Rep2_API_5', Value: 'RepW_Value' }
              ]
            }
          ]
        }
      ]
    }
  };

  getBodyItems(process: any) {
    console.log("process: ", (process));
    // Return the items in the 'Body' section of the process
    return process.Sections.find((section: any) => section.Name === 'Body')?.Items || 'shet';
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
}
