import inquirer from 'inquirer';
import { securityTools } from './config.js';

export async function promptUser() {
  const questions = Object.entries(securityTools).flatMap(([key, tool]) => [
    {
      type: 'confirm',
      name: `run${tool.name}`,
      message: `${tool.message}\n   ${tool.explanation}\n   Do you want to proceed?`,
      default: true,
    },
    ...(tool.additionalPrompt ? [tool.additionalPrompt] : []),
  ]);

  console.log('\nPlease confirm which security tools you\'d like to run:');
  return inquirer.prompt(questions);
}
