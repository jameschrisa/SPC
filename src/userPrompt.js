import inquirer from 'inquirer';
import { securityTools } from './config.js';

export async function promptUser() {
  const questions = Object.entries(securityTools).flatMap(([key, tool]) => [
    {
      type: 'confirm',
      name: `run${tool.name}`,
      message: tool.message,
      default: true,
    },
    ...(tool.additionalPrompt ? [tool.additionalPrompt] : []),
  ]);

  return inquirer.prompt(questions);
}
