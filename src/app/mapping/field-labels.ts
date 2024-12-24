export class FieldLabels {
    static labels: { [key: string]: string } = {
      mpoDate: 'MPO Date',
      mpoAmount: 'MPO Amount',
      vendor: 'Vendor',
      location: 'Location',
      customerCode: 'Customer Code',
      firstName: 'First Name',
      lastName: 'Last Name',
      logisticRoute: 'Logistic Route',
      salesRoute: 'Sales Route',
      salesType: 'Sales Type',
      siDate: 'SI Date',
      siNumber: 'SI Number',
      soDate: 'SO Date',
      soNumber: 'SO Number',
    };
  
    static getLabel(key: string): string {
      return this.labels[key] || key; // Fallback to the key if no label is found
    }
  }
  