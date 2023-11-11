class GoogleSheets {
  
  public readonly file: GoogleAppsScript.Spreadsheet.Spreadsheet;
  public readonly sheet: GoogleAppsScript.Spreadsheet.Sheet;

  /**
   * @param sheetName - The name of the sheet to be accessed.
   * @param spreadsheetId - The ID of the spreadsheet (optional). If not provided, the
   * active spreadsheet is used.
   */
  constructor(
    public readonly sheetName: string,
    public readonly spreadsheetId?: string,
  ) {
    this.file = (spreadsheetId)
      ? SpreadsheetApp.openById(spreadsheetId)
      : SpreadsheetApp.getActiveSpreadsheet();

    this.sheet = this.getSheet(sheetName);
  }

  //////////////////////
  ////    Public    ////
  //////////////////////
  
  /**
   * Retrieves key-value pairs from the specified columns in the sheet.
   * 
   * @param keysHeader - The header text of the column to be used as keys.
   * @param valuesHeader - The header text of the column to be used as values.
   * @returns A record object with keys mapped to their corresponding values.
   * @throws Will throw an error if no matching key/value pairs are found.
   */
  public get(
    keysHeader: string,
    valuesHeader: string,
  ): Record<string, any | undefined> {

    const keys = this.getColumnValues(keysHeader);
    const values = this.getColumnValues(valuesHeader);

    const keyValuePairs = keys.reduce(
      (acc, key, index) => {
        return { ...acc, [key]: this.parse(values[index]) };
      },
      {} as Record<string, any | undefined>,
    );

    if (keys.length) {
      console.log(`[GoogleSheets] Returned '${this.sheetName}' records as an object.`);
      return keyValuePairs;
    }

    throw new Error(
      `🔴 [GoogleSheets] No matching key/value pairs found in sheet: ${this.sheetName}`
    );
  }

  public getAs<T>(
    Class: { new(arg1: any, arg2: any): T },
    keysHeader: string,
    valuesHeader: string,
  ): T[] {

    const keys = this.getColumnValues(keysHeader);
    const values = this.getColumnValues(valuesHeader);

    const keyValuePairs = keys.reduce(
      (acc, key, index) => {
        return { ...acc, [key]: this.parse(values[index]) };
      },
      {} as Record<string, any | undefined>,
    );
    
    const objects = Object.keys(keyValuePairs).map(
      key => new Class(key, keyValuePairs[key])
    );

    if (objects.length) {
      console.log(
        `[GoogleSheets] Returned '${this.sheetName}' records as an array of ` +
        `'${Class.name}' objects.`
      );
      return objects;
    }

    throw new Error(
      `🔴 [GoogleSheets] No matching key/value pairs found in sheet: ${this.sheetName}`
    );
  }

  /////////////////////////
  ////    Protected    ////
  /////////////////////////

  protected getSheet(sheetName: string): GoogleAppsScript.Spreadsheet.Sheet {
    const sheet = this.file.getSheetByName(sheetName);

    if (sheet) {
      return sheet;
    }
    throw new Error(`🔴 [GoogleSheets] Sheet not found: ${sheetName}`);
  }

  protected getColumnValues(columnName: string): string[] {
    const allCellValues = this.sheet
      .getRange(1, 1, this.sheet.getLastRow(), this.sheet.getLastColumn())
      .getValues();

    const { rowIndex, colIndex } = this.findColumnIndices(columnName, allCellValues);

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

  protected findColumnIndices(
    columnName: string,
    allCellValues: Array<number | string | null | undefined>[]
  ): { rowIndex: number, colIndex: number } {

    return allCellValues.reduce(

      (acc, row, rowIndex) => {
        const colIndex = row.findIndex(cell => cell === columnName);
        return colIndex !== -1
          ? { rowIndex, colIndex }
          : acc;
      },

      { rowIndex: -1, colIndex: -1 },
    );
  }

  private parse(value: string): any {
    try {
      return value ? JSON.parse(value) : undefined;
    }
    catch {
      return value;
    }
  }

}