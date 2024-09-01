import { runSecurityProtocol } from './securityProtocol.js';

console.log('Welcome to the Security Protocol CLI');

const mockMode = process.argv.includes('--mock');

runSecurityProtocol(mockMode).catch(console.error);
