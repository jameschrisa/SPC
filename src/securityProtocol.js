import { checkDependencies } from './dependencyChecker.js';
import { executeCommand } from './commandExecutor.js';
import { promptUser } from './userPrompt.js';
import { securityTools } from './config.js';
import { initializeLogFiles, appendToReport } from './utils.js';

async function runTool(tool, answers, mockMode) {
  const toolKey = tool.name.toLowerCase();
  if (answers[`run${tool.name}`]) {
    try {
      let args = [...tool.args];
      if (tool.additionalPrompt) {
        const additionalValue = answers[tool.additionalPrompt.name];
        if (toolKey === 'nmap') {
          args.push(additionalValue);
        } else if (toolKey === 'tshark') {
          args.push('-a', `duration:${additionalValue}`, '-w', 'captured_traffic.pcap');
        }
      }
      const result = await executeCommand(tool, args, tool.estimatedDuration, mockMode);
      return { command: tool.name, status: 'Success', duration: result.duration };
    } catch (error) {
      return { command: tool.name, status: 'Failed', error: error.message };
    }
  }
  return null;
}

export async function runSecurityProtocol(mockMode = false) {
  await initializeLogFiles();

  console.log('Checking for required dependencies...');
  await checkDependencies(mockMode);

  const answers = await promptUser();
  const results = [];

  for (const tool of Object.values(securityTools)) {
    const result = await runTool(tool, answers, mockMode);
    if (result) {
      results.push(result);
    }
  }

  // Generate report
  for (const result of results) {
    const reportLine = `${result.command}: ${result.status} ${result.duration ? `(${result.duration}ms)` : ''}\n`;
    await appendToReport(reportLine);
  }

  console.log('Security protocol execution completed. Check the log and report files for details.');
}
