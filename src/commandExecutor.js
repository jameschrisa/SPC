import { spawn } from 'child_process';
import { createInterface } from 'readline';
import cliProgress from 'cli-progress';
import { appendToLog } from './utils.js';

export async function executeCommand(tool, args, estimatedDuration = 8000, mockMode = false, setCurrentProcess) {
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

  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const child = spawn(tool.command, args, { stdio: ['ignore', 'pipe', 'pipe'] });

    setCurrentProcess(child);

    let output = '';

    const rl = createInterface({ input: child.stdout });
    rl.on('line', (line) => {
      console.log(line);
      output += line + '\n';
    });

    const errRl = createInterface({ input: child.stderr });
    errRl.on('line', (line) => {
      console.error(line);
      output += line + '\n';
    });

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(Math.floor((elapsed / estimatedDuration) * 100), 99);
      bar.update(progress);
      
      if (progress < 99 && !child.killed) {
        setTimeout(updateProgress, 100);
      }
    };

    updateProgress();

    child.on('close', async (code) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      bar.update(100);
      bar.stop();

      await appendToLog(`Command output:\n${output}\n`);
      await appendToLog(`Command completed in ${duration}ms with exit code ${code}\n`);

      console.log(`\nCommand ${tool.name} completed ${code === 0 ? 'successfully' : 'with errors'}.`);
      
      if (code === 0) {
        resolve({ output, duration });
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}
