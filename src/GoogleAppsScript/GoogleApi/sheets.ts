type CellValue = number | string | null | undefined;
type RowValues = Array<CellValue>;

class Contact {
  constructor(public name: string, public phoneNumber: string) { }
}

class AddressBook {
  
  public contacts: Contact[];

  private file: GoogleAppsScript.Spreadsheet.Spreadsheet;
  private sheet: GoogleAppsScript.Spreadsheet.Sheet;
  private maxRow: number;
  private maxColumn: number;

  constructor(private spreadSheetId?: string) {
    this.file = (spreadSheetId)
      ? SpreadsheetApp.openById(spreadSheetId)
      : SpreadsheetApp.getActiveSpreadsheet();
    this.sheet = this.getSheet();
    this.maxRow = this.sheet.getLastRow();
    this.maxColumn = this.sheet.getLastColumn();
    this.contacts = this.getContacts();
  }
  // Public methods

  public getContact(name: string): Contact {
    const contact = this.contacts.find(contact => {
      return contact.name.toLowerCase() === name.toLowerCase()
    });
    if (contact) {
      console.log(`Located contact: ${JSON.stringify(contact)}`);
      return contact;
    }
    
    throw new Error(`No contact with the name '${name}' was found.`);
  }

  public getContacts(): Contact[] {
    const contactNames = this.getColumnValues("contactName");
    const contactPhoneNumbers = this.getColumnValues("contactPhoneNumber");
    const contacts = this.zip(contactNames, contactPhoneNumbers)
      .map(([name, phoneNumber]) => new Contact(name, phoneNumber));
      
    if (contacts.length) {
      console.log(`Located contacts: ${JSON.stringify(contacts)}`);
      return contacts;
    }
    
    throw new Error("No contacts were found in the sheet.");
  }

  public getPhoneNumberByName(name: string): string {
    const contact = this.contacts.find(contact => {
      return contact.name.toLowerCase() === name.toLowerCase()
    });
    
    if (contact) {
      console.log(`Located contact: ${JSON.stringify(contact)}`);
      return contact.phoneNumber;
    }
    
    throw new Error(`No contact with the name '${name}' was found.`);
  }

  public getNameByPhoneNumber(phoneNumber: string): string {
    const contact = this.contacts.find(contact => {
      const providedPhoneNumber = this.normalizePhoneNumber(phoneNumber);
      const addressBookPhoneNumber = this.normalizePhoneNumber(contact.phoneNumber);
      return providedPhoneNumber === addressBookPhoneNumber;
    });
    
    if (contact) {
      console.log(`Located contact: ${JSON.stringify(contact)}`);
      return contact.name;
    }
    
    throw new Error(`No contact with the phone number '${phoneNumber}' was found.`);
  }
  // Private methods

  private getSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    const sheet = this.file.getSheetByName("AddressBook");
    
    if (sheet) {
      console.log(`Located sheet: ${sheet}`);
      return sheet;
    }
    
    throw new Error("No sheet by the name of 'AddressBook' was found.");
  }

  private getColumnValues(columnName: string): string[] {
    const allCellValues = this.sheet
      .getRange(1, 1, this.maxRow, this.maxColumn)
      .getValues();
      
    const { rowIndex, colIndex } = this.findColumnIndices(columnName, allCellValues);
    const isNotHeaderFound = rowIndex === -1 || colIndex === -1;
    
    if (isNotHeaderFound) {
      throw new Error(`The header '${columnName}' was not found in the sheet.`);
    }
    
    const columnValues = allCellValues
      .slice(rowIndex + 1)
      .map(row => row[colIndex]?.toString().trim() || "");
      
    const lastNonEmptyRowIndex = columnValues
      .map((value, index) => value !== "" ? index : -1)
      .reverse()
      .find(index => index !== -1);
      
    return (lastNonEmptyRowIndex !== undefined)
      ? columnValues.slice(0, lastNonEmptyRowIndex + 1)
      : [];
  }

  private findColumnIndices(
    columnName: string,
    allCellValues: RowValues[]
  ): { rowIndex: number, colIndex: number } {
    
    return allCellValues.reduce((acc, row, rowIndex) => {
      
      const colIndex = row.findIndex(cell => cell === columnName);
      return colIndex !== -1
        ? { rowIndex, colIndex }
        : acc;
        
    }, { rowIndex: -1, colIndex: -1 });
  }
  
  private zip(names: string[], phoneNumbers: string[]): Array<[string, string]> {
    const maxLength = Math.max(names.length, phoneNumbers.length);
    
    return Array.from({ length: maxLength }, (_, i) => [
      names[i] ?? "",
      phoneNumbers[i] ?? "",
    ]);
  }

  private normalizePhoneNumber(phoneNumber: string): string {
    const digits = this.getDigits(phoneNumber);
    const match = {
      IS_PHONE_EXTENSION: 6,
      IS_PHONE_NUMBER_WITHOUT_COUNTRY_CODE: 10,
      IS_PHONE_NUMBER_WITH_COUNTRY_CODE: 11
    }
    switch (digits.length) {
      case match.IS_PHONE_EXTENSION:
        return digits;

      case match.IS_PHONE_NUMBER_WITHOUT_COUNTRY_CODE:
        return `+1${digits}`;

      case match.IS_PHONE_NUMBER_WITH_COUNTRY_CODE:
        return `+${digits}`;

      default:
        throw new Error(`Invalid phone number provided: ${phoneNumber}`);
    }
  }

  private getDigits(phoneNumber: string): string {
    const digitsArray = phoneNumber.match(/\d/g);
    
    return digitsArray
      ? digitsArray.join('')
      : '';
  }
  
}
