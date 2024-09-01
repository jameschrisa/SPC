import { spawn } from 'child_process';
import { createInterface } from 'readline';
import cliProgress from 'cli-progress';
import { appendToLog } from './utils.js';

export async function executeCommand(tool, args, estimatedDuration = 8000, mockMode = false) {
  console.log(`Executing: ${tool.command} ${args.join(' ')}`);
  await appendToLog(`\nExecuting: ${tool.command} ${args.join(' ')}\n`);

  console.log('\nExplanation:');
  console.log(tool.explanation);
  console.log('\nProgress:');

  const bar = new cliProgress.SingleBar({
    format: '{bar} {percentage}% | ETA: {eta}s | {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  bar.start(100, 0);

  if (mockMode) {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        bar.update(progress);
        if (progress >= 100) {
          clearInterval(interval);
          bar.stop();
          console.log(`\n[MOCK] Command ${tool.name} completed successfully.`);
          resolve({ output: '[MOCK] Command output', duration: estimatedDuration });
        }
      }, estimatedDuration / 10);
    });
  }

  // ... rest of the function remains the same
}
