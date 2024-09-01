import inquirer from 'inquirer';
import { securityTools } from './config.js';

const commonIpRanges = [
  '192.168.1.0/24',
  '10.0.0.0/24',
  '172.16.0.0/16',
  'localhost'
];

export async function promptUser() {
  const questions = [];

  for (const [key, tool] of Object.entries(securityTools)) {
    questions.push({
      type: 'confirm',
      name: `run${tool.name}`,
      message: `${tool.message}\n   ${tool.explanation}\n   Do you want to proceed?`,
      default: true,
    });

    if (tool.name === 'Nmap') {
      questions.push({
        type: 'list',
        name: 'nmapTarget',
        message: 'Select an IP range to scan:',
        choices: [...commonIpRanges, new inquirer.Separator(), 'Custom'],
        when: (answers) => answers.runNmap
      });
      questions.push({
        type: 'input',
        name: 'customNmapTarget',
        message: 'Enter the custom IP range for Nmap scan (e.g., 192.168.1.0/24):',
        when: (answers) => answers.runNmap && answers.nmapTarget === 'Custom',
        validate: (value) => value.length > 0 || 'Please enter a valid IP range'
      });
    } else if (tool.additionalPrompt) {
      questions.push({
        ...tool.additionalPrompt,
        when: (answers) => answers[`run${tool.name}`]
      });
    }
  }

  console.log('\nPlease confirm which security tools you\'d like to run:');
  const answers = await inquirer.prompt(questions);

  // If custom Nmap target was selected, use that value
  if (answers.nmapTarget === 'Custom') {
    answers.nmapTarget = answers.customNmapTarget;
  }

  return answers;
}
