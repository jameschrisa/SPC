import { checkDependencies } from './dependencyChecker.js';
import { executeCommand } from './commandExecutor.js';
import { promptUser } from './userPrompt.js';
import { securityTools } from './config.js';
import { initializeLogFiles, appendToReport } from './utils.js';
import readline from 'readline';

let currentProcess = null;

function setupAbortHandler() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('SIGINT', () => {
    if (currentProcess) {
      console.log('\nAborting current process...');
      currentProcess.kill('SIGINT');
      currentProcess = null;
    } else {
      console.log('\nNo process currently running. Exiting...');
      process.exit(0);
    }
  });

  return rl;
}

async function runTool(tool, answers, mockMode) {
  const toolKey = tool.name.toLowerCase();
  if (answers[`run${tool.name}`]) {
    try {
      let args = [...tool.args];
      if (tool.additionalPrompt) {
        const additionalValue = answers[tool.additionalPrompt.name];
        if (toolKey === 'nmap') {
          args.push(additionalValue);
        } else if (toolKey === 'tcpdump') {
          args.push('-c', additionalValue);
        }
      }
      console.log(`\nStarting ${tool.name}...`);
      console.log('Press Ctrl+C to abort the current process.\n');
      const result = await executeCommand(tool, args, tool.estimatedDuration, mockMode, (process) => {
        currentProcess = process;
      });
      currentProcess = null;
      return { command: tool.name, status: 'Success', duration: result.duration };
    } catch (error) {
      currentProcess = null;
      return { command: tool.name, status: 'Failed', error: error.message };
    }
  }
  return null;
}

export async function runSecurityProtocol(mockMode = false) {
  await initializeLogFiles();

  console.log('Checking for required dependencies...');
  await checkDependencies(mockMode);

  const rl = setupAbortHandler();

  const answers = await promptUser();
  const results = [];

  for (const tool of Object.values(securityTools)) {
    const result = await runTool(tool, answers, mockMode);
    if (result) {
      results.push(result);
      const reportLine = `${result.command}: ${result.status} ${result.duration ? `(${result.duration}ms)` : ''}\n`;
      await appendToReport(reportLine);
      console.log(`\n${result.command} completed. Press Enter to continue...`);
      await new Promise(resolve => rl.question('', resolve));
    }
  }

  rl.close();

  console.log('Security protocol execution completed. Check the log and report files for details.');
}
