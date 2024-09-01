import { promisify } from 'util';
import { exec } from 'child_process';
import { securityTools } from './config.js';

const execAsync = promisify(exec);

export async function checkDependencies(mockMode = false) {
  const missingDependencies = [];

  for (const [key, tool] of Object.entries(securityTools)) {
    if (mockMode) {
      console.log(`[MOCK] ${tool.name} is assumed to be installed.`);
    } else {
      try {
        await execAsync(tool.checkCommand);
        console.log(`${tool.name} is installed.`);
      } catch (error) {
        console.error(`${tool.name} is not installed or not in PATH.`);
        missingDependencies.push(key);
      }
    }
  }

  if (missingDependencies.length > 0 && !mockMode) {
    console.error('The following dependencies are missing:');
    missingDependencies.forEach(dep => console.error(`- ${securityTools[dep].name}`));
    console.error('Please install these dependencies before running the security protocol.');
    console.error('For development purposes, you can run the script in mock mode.');
    process.exit(1);
  }
}
