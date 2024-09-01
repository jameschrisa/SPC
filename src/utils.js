import fs from 'fs/promises';

export const logFile = 'security_protocol_log.txt';
export const reportFile = 'security_protocol_report.txt';

export async function initializeLogFiles() {
  await fs.writeFile(logFile, 'Security Protocol Execution Log\n');
  await fs.writeFile(reportFile, 'Security Protocol Execution Report\n');
}

export async function appendToLog(content) {
  await fs.appendFile(logFile, content);
}

export async function appendToReport(content) {
  await fs.appendFile(reportFile, content);
}
