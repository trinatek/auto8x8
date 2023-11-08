class GoogleSheets {
  public readonly file: GoogleAppsScript.Spreadsheet.Spreadsheet;
  public readonly sheet: GoogleAppsScript.Spreadsheet.Sheet;
  public readonly keys: string[];
  public readonly properties: Record<string, string | undefined>;

  private readonly maxRow: number;
  private readonly maxColumn: number;

  constructor(
    public readonly sheetName: string,
    public readonly keysColumnHeader: string,
    public readonly valuesColumnHeader: string,
    public readonly spreadsheetId?: string,
  ) {
    this.file = (spreadsheetId)
      ? SpreadsheetApp.openById(spreadsheetId)
      : SpreadsheetApp.getActiveSpreadsheet();
    this.sheet = this.getSheet(sheetName);
    this.maxRow = this.sheet.getLastRow();
    this.maxColumn = this.sheet.getLastColumn();
    this.properties = this.getValues();
    this.keys = Object.keys(this.properties);
  }

  //////////////////////
  ////    Public    ////
  //////////////////////

  public getValueByKey(name: string): any {
    const value = this.properties[name];

    if (value !== undefined) {
      log(`[GOOGLE SHEETS] Retrieved '${this.sheetName}.${name}' value.`);
      return JSON.parse(value);
    }
    else {
      console.warn(`[GOOGLE SHEETS] '${this.sheetName}.${name}' returned undefined.`);
      return undefined;
    }
  }

  /////////////////////////
  ////    Protected    ////
  /////////////////////////

  protected getSheet(sheetName: string): GoogleAppsScript.Spreadsheet.Sheet {
    const sheet = this.file.getSheetByName(sheetName);
    if (sheet)
      return sheet;
    throw new Error(`[GOOGLE SHEETS] No sheet by the name of ${sheetName} was found.`);
  }
  
  protected getValues(): Record<string, string | undefined> {
    const keys = this.getColumnValues(this.keysColumnHeader);
    const values = this.getColumnValues(this.valuesColumnHeader);
    
    const keyValuePairs = keys.reduce(
      (acc, key, index) => ({ ...acc, [key]: values[index] ?? undefined }),
      {} as Record<string, string | undefined>,
    );
    const isAnEmptyObject = !Object.keys(keyValuePairs).length;
    
    if (isAnEmptyObject) {
      throw new Error(
        `[GOOGLE SHEETS] No matching key/value ('${this.keysColumnHeader}'/'${this.valuesColumnHeader}') pairs were found in sheet name: ${this.sheetName}`
      );
    }
    log(
      `[GOOGLE SHEETS] Successfully loaded '${this.sheetName}'.\n`,
      `${JSON.stringify(this.obfuscateObject(keyValuePairs, 4), null, 2)}`
    );
    return keyValuePairs;
  }

  protected getColumnValues(columnName: string): string[] {
    const allCellValues = this.sheet
      .getRange(1, 1, this.maxRow, this.maxColumn)
      .getValues();

    const { rowIndex, colIndex } = this.findColumnIndices(columnName, allCellValues);
    const isNotHeaderFound = rowIndex === -1 || colIndex === -1;

    if (isNotHeaderFound) {
      throw new Error(
        `[GOOGLE SHEETS] The header '${columnName}' was not found in the sheet.`
      );
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

  protected findColumnIndices(
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

  protected zip(names: string[], phoneNumbers: string[]): Array<[string, string]> {
    const maxLength = Math.max(names.length, phoneNumbers.length);

    return Array.from({ length: maxLength }, (_, i) => [
      names[i] ?? "",
      phoneNumbers[i] ?? "",
    ]);
  }

  protected obfuscateObject(obj: any, showFirst: number = 0): any {
    return Object.entries(obj).reduce(

      (accRecords, [key, value]) => {
        const isString = typeof value === "string";
        const isObject = value && typeof value === "object";
        const obfuscatedRecord = {
          [key]: (isString)
            ? this.obfuscate(value, showFirst)
            : (isObject)
              ? this.obfuscateObject(value, showFirst)
              : value,
        };
        return { ...accRecords, ...obfuscatedRecord };
      },

      {} as Record<string, any>,
    );
  }

  protected obfuscate(value: string, showFirst: number = 0): string {
    const visibleChars = (value.length <= showFirst) ? 0 : showFirst;
    return value.substring(0, visibleChars) + "*".repeat(value.length - visibleChars);
  }

}