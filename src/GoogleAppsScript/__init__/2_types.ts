type CellValue = number | string | null | undefined;
type RowValues = Array<CellValue>;

class Contact {
  constructor(public name: string, public phoneNumber: string) {}
}