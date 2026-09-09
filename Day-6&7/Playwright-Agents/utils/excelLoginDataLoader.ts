import * as fs from 'fs';
import * as path from 'path';
import type { ExcelLoginCredentialRow } from '../types/excelLoginData';

// lazy-import xlsx to produce a clear error if the dependency is missing at runtime
let xlsx: any | undefined;

export const EXCEL_LOGIN_CREDENTIALS_FILE = 'test-data/excel-login-credentials.xlsx';
export const EXCEL_LOGIN_SHEET_NAME = 'Sheet1';

function normalizeCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
}

export function loadExcelLoginCredentialRows(
  relativePath: string = EXCEL_LOGIN_CREDENTIALS_FILE,
  sheetName: string = EXCEL_LOGIN_SHEET_NAME,
): ExcelLoginCredentialRow[] {
  // ensure xlsx is available
  if (!xlsx) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      xlsx = require('xlsx');
    } catch (err) {
      throw new Error(
        'Missing dependency "xlsx". Run "npm install" in the project root to install required packages.',
      );
    }
  }
  const absolutePath = path.resolve(process.cwd(), relativePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Excel login data file not found: ${absolutePath}`);
  }

  const workbook = xlsx.readFile(absolutePath);
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    const availableSheets = workbook.SheetNames.join(', ');
    throw new Error(`Worksheet "${sheetName}" not found in ${absolutePath}. Available sheets: ${availableSheets}`);
  }

  // @ts-ignore
  const rawRows = xlsx.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

  return rawRows
    .map((row: { [x: string]: unknown; Username: unknown; Password: unknown; Notes: unknown; }) => ({
      username: normalizeCellValue(row.Username),
      password: normalizeCellValue(row.Password),
      userType: normalizeCellValue(row['User Type']),
      notes: normalizeCellValue(row.Notes),
    }))
    .filter((row: { username: string | any[]; }) => row.username.length > 0);
}

