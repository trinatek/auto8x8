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

// class GoogleSheets {
//   public readonly file: GoogleAppsScript.Spreadsheet.Spreadsheet;
//   public readonly sheet: GoogleAppsScript.Spreadsheet.Sheet;
//   public readonly keys: string[];
//   public readonly properties: Record<string, string | undefined>;
  
//   private maxRow: number;
//   private maxColumn: number;

//   constructor(
//     public readonly sheetName: string,
//     public readonly keysColumnHeader: string,
//     public readonly valuesColumnHeader: string,
//     public readonly spreadsheetId?: string,
//   ) {
//     this.file = (spreadsheetId)
//       ? SpreadsheetApp.openById(spreadsheetId)
//       : SpreadsheetApp.getActiveSpreadsheet();
//     this.sheet = this.getSheet(sheetName);
//     this.maxRow = this.sheet.getLastRow();
//     this.maxColumn = this.sheet.getLastColumn();
//     this.properties = this.getValues();
//     this.keys = Object.keys(this.properties);
//     log(
//       `[GOOGLE SHEETS] Loaded the following keys from '${this.sheetName}':\n`,
//       `${JSON.stringify(this.keys, null, 2)}`,
//     );
//   }

//   //////////////////////
//   ////    Public    ////
//   //////////////////////

//   public get(name: string): any {
//     const value = this.properties[name];
    
//     if (value !== undefined) {
//       log(`[GOOGLE SHEETS] Retrieved '${this.sheetName}.${name}' value.`);
//       return JSON.parse(value);
      
//     } else {
//       console.warn(`[GOOGLE SHEETS] '${this.sheetName}.${name}' returned undefined.`);
//       return undefined;
//     }
//   }

//   /////////////////////////
//   ////    Protected    ////
//   /////////////////////////

//   protected getSheet(sheetName: string): GoogleAppsScript.Spreadsheet.Sheet {
//     const sheet = this.file.getSheetByName(sheetName);
    
//     if (sheet) {
//       console.log(`[GOOGLE SHEETS] Located sheet: ${sheetName}`);
//       return sheet;
//     }
    
//     throw new Error(`[GOOGLE SHEETS] No sheet by the name of ${sheetName} was found.`);
//   }
  
//   protected getValues(): Record<string, string | undefined> {
//     const keys = this.getColumnValues(this.keysColumnHeader);
//     const values = this.getColumnValues(this.valuesColumnHeader);
//     const keyValueObject: Record<string, string | undefined> = {};
    
//     keys.forEach((key, index) => {
//       keyValueObject[key] = values[index] ?? undefined; 
//     });

//     if (Object.keys(keyValueObject).length) {
//       log(
//         `[GOOGLE SHEETS] Located '${this.sheetName}' key/value pairs:\n`,
//         `${JSON.stringify(keyValueObject, null, 2)}`,
//       );
//       return keyValueObject;
//     }
//     throw new Error(
//       `[GOOGLE SHEETS] No matching key/value ('${this.keysColumnHeader}'/'${this.valuesColumnHeader}') pairs were found in sheet name: ${this.sheetName}`,
//     );
//   }

//   protected getColumnValues(columnName: string): string[] {
//     const allCellValues = this.sheet
//       .getRange(1, 1, this.maxRow, this.maxColumn)
//       .getValues();
      
//     const { rowIndex, colIndex } = this.findColumnIndices(columnName, allCellValues);
//     const isNotHeaderFound = rowIndex === -1 || colIndex === -1;
    
//     if (isNotHeaderFound) {
//       throw new Error(
//         `[GOOGLE SHEETS] The header '${columnName}' was not found in the sheet.`
//       );
//     }
    
//     const columnValues = allCellValues
//       .slice(rowIndex + 1)
//       .map(row => row[colIndex]?.toString().trim() || "");
      
//     const lastNonEmptyRowIndex = columnValues
//       .map((value, index) => value !== "" ? index : -1)
//       .reverse()
//       .find(index => index !== -1);
      
//     return (lastNonEmptyRowIndex !== undefined)
//       ? columnValues.slice(0, lastNonEmptyRowIndex + 1)
//       : [];
//   }

//   protected findColumnIndices(
//     columnName: string,
//     allCellValues: RowValues[]
//   ): { rowIndex: number, colIndex: number } {
    
//     return allCellValues.reduce((acc, row, rowIndex) => {
      
//       const colIndex = row.findIndex(cell => cell === columnName);
//       return colIndex !== -1
//         ? { rowIndex, colIndex }
//         : acc;
        
//     }, { rowIndex: -1, colIndex: -1 });
//   }

//   protected zip(names: string[], phoneNumbers: string[]): Array<[string, string]> {
//     const maxLength = Math.max(names.length, phoneNumbers.length);

//     return Array.from({ length: maxLength }, (_, i) => [
//       names[i] ?? "",
//       phoneNumbers[i] ?? "",
//     ]);
//   }
// }