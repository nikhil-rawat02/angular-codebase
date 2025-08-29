import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExcelService {
  EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';

  async exportAsExcelFile(
    workbookData: any[],
    excelFileName: string
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const dropdownSheet = workbook.addWorksheet('DropdownData');
    dropdownSheet.state = 'veryHidden';

    let dropdownRowCounter = 1;
    const dropdownMap = new Map<string, string>();

    workbookData.forEach(({ workSheet, rows }) => {
      const sheet = workbook.addWorksheet(workSheet);
      const uniqueHeaders = [
        ...new Set(
          rows.reduce(
            (prev: any, next: {}) => [...prev, ...Object.keys(next)],
            []
          )
        ),
      ];
      sheet.columns = uniqueHeaders.map((x: any) => ({ header: x, key: x }));

      rows.forEach((jsonRow: { [x: string]: any }, i: number) => {
        let cellValues = { ...jsonRow };

        uniqueHeaders.forEach((header: any) => {
          if (Array.isArray(jsonRow[header])) {
            cellValues[header] = '';
          }
        });
        sheet.addRow(cellValues);
        uniqueHeaders.forEach((header: any, colIndex: number) => {
          const dropdownList = jsonRow[header];

          if (Array.isArray(dropdownList) && dropdownList.length > 0) {
            const dropdownKey = dropdownList.join('|');
            let rangeRef: string;

            if (dropdownMap.has(dropdownKey)) {
              rangeRef = dropdownMap.get(dropdownKey)!;
            } else {
              const startRow = dropdownRowCounter;
              dropdownList.forEach((value, i) => {
                dropdownSheet.getCell(`A${startRow + i}`).value = value;
              });

              rangeRef = `DropdownData!$A$${startRow}:$A$${
                startRow + dropdownList.length - 1
              }`;
              dropdownMap.set(dropdownKey, rangeRef);
              dropdownRowCounter += dropdownList.length;
            }

            const cellAddress = this.getSpreadSheetCellNumber(i + 1, colIndex);
            sheet.getCell(cellAddress).dataValidation = {
              type: 'list',
              allowBlank: true,
              formulae: [`=${rangeRef}`],
            };
          }
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    this.saveAsExcelFile(buffer, excelFileName);
  }

  private getSpreadSheetCellNumber(row: number, column: number): string {
    let result = '';

    // Get spreadsheet column letter
    let n = column;
    while (n >= 0) {
      result = String.fromCharCode((n % 26) + 65) + result;
      n = Math.floor(n / 26) - 1;
    }

    // Get spreadsheet row number
    result += `${row + 1}`;

    return result;
  }

  private saveAsExcelFile(buffer: ExcelJS.Buffer, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: this.EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + this.EXCEL_EXTENSION
    );
  }

  /**
   * Generates mock worksheet data for Excel exports.
   *
   * @param sheetsData - An array of sheet data containing sheet name and value mappings.
   * @param rowCount - Number of rows to generate for each sheet (default: 2000).
   * @returns An array of objects with sheet name and generated rows.
   *
   * @example
   * generateMockExcelData([
   *   {
   *     name: 'Students',
   *     values: [
   *       { header: 'Name', value: 'John Doe' },
   *       { header: 'Subjects', value: [{ name: 'Math' }, { name: 'Science' }] }
   *     ]
   * ])
   *
   * // Returns:
   * // [
   * //   {
   * //     workSheet: 'Students',
   * //     rows: [{ Name: 'John Doe', Subjects: ['Math', 'Science'] }, ... 2000 times ]
   * //   }
   * // ]
   */
  generateMockExcelData(
    sheetsData: { name: string; values: { header: string; value: any }[] }[],
    rowCount = 20
  ): { workSheet: string; rows: Record<string, any>[] }[] {
    return sheetsData.map(({ name, values }) => {
      const headers = values.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.header]: Array.isArray(curr.value)
            ? curr.value.map((item: any) => item.name)
            : curr.value,
        };
      }, {});

      return {
        workSheet: name,
        rows: Array(rowCount).fill(headers),
      };
    });
  }
}
