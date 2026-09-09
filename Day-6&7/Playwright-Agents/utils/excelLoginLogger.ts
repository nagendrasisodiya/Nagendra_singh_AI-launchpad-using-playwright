import * as fs from 'fs';
import * as path from 'path';

const logFilePath = path.resolve(process.cwd(), 'test-results', 'excel-login-automation.log');
fs.mkdirSync(path.dirname(logFilePath), { recursive: true });

function writeLine(level: string, message: string): void {
  const line = `${new Date().toISOString()} [${level}] ${message}`;
  // eslint-disable-next-line no-console
  console.log(line);
  fs.appendFileSync(logFilePath, `${line}\n`, 'utf8');
}

export const excelLoginLogger = {
  info(message: string): void {
    writeLine('INFO', message);
  },
  warn(message: string): void {
    writeLine('WARN', message);
  },
  error(message: string): void {
    writeLine('ERROR', message);
  },
};

export function maskSecret(value: string): string {
  if (!value) {
    return '';
  }

  if (value.length <= 2) {
    return '*'.repeat(value.length);
  }

  return `${value.slice(0, 1)}${'*'.repeat(Math.max(value.length - 2, 2))}${value.slice(-1)}`;
}

export function logExcelLoginScenario(details: {
  testCaseId: string;
  username: string;
  userType: string;
  password: string;
  workbookFile: string;
}): void {
  excelLoginLogger.info(
    `TestCase=${details.testCaseId} | UserType=${details.userType} | Username=${details.username} | Password=${maskSecret(details.password)} | Workbook=${details.workbookFile}`,
  );
}

