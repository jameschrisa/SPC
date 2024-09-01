import { runSecurityProtocol } from './securityProtocol.js';
import os from 'os';

console.log('Welcome to the Mac Security Protocol CLI');

const operatingSystem = os.type();
if (operatingSystem !== 'Darwin') {
  console.warn('Warning: This tool is designed for macOS (Darwin-based) systems. Some features may not work correctly on your system.');
}

console.log('\nThis application provides a suite of security tools for your Mac:');
console.log('1. Nmap: Network scanner for discovering open ports and services');
console.log('2. ClamAV: Antivirus scanner for detecting malware');
console.log('3. Lynis: Security auditing tool for system hardening');
console.log('4. tcpdump: Network packet analyzer for monitoring network traffic');
console.log('5. brew audit: Vulnerability checker for installed Homebrew packages');

console.log('\nEach tool will be run with your permission, and you\'ll be provided with real-time updates and explanations.');
console.log('Please ensure you have the necessary permissions to run these tools.\n');

const mockMode = process.argv.includes('--mock');

if (mockMode) {
  console.log('Running in mock mode. No actual system changes will be made.\n');
}

runSecurityProtocol(mockMode).catch(console.error);
