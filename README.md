# Mac Security Protocol CLI

## Overview
The Mac Security Protocol CLI is a comprehensive security tool designed specifically for macOS (Darwin-based) systems. It provides a suite of security applications that allow users to perform various security checks and analyses on their Mac computers.

## Purpose
The primary purpose of this tool is to enable Mac users to conduct thorough security assessments of their systems using a collection of powerful, open-source security tools. By automating the execution of these tools and providing clear, user-friendly output, this CLI makes it easier for both security professionals and regular users to maintain the security of their Mac systems.

## Features
This CLI integrates the following security tools:

1. **Nmap**: Network scanner for discovering open ports and services
2. **ClamAV**: Antivirus scanner for detecting malware
3. **Lynis**: Security auditing tool for system hardening
4. **tcpdump**: Network packet analyzer for monitoring network traffic
5. **brew audit**: Vulnerability checker for installed Homebrew packages

## Requirements
To run this application, you need:

- macOS (Darwin-based) operating system
- Node.js (version 12 or higher)
- npm (usually comes with Node.js)
- Homebrew package manager
- The following security tools installed via Homebrew:
  - nmap
  - clamav
  - lynis
  - tcpdump

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/mac-security-protocol-cli.git
   cd mac-security-protocol-cli
   ```

2. Install the required Node.js dependencies:
   ```
   npm install
   ```

3. Install the required security tools using Homebrew:
   ```
   brew install nmap clamav lynis
   ```

4. Ensure ClamAV's virus database is up-to-date:
   ```
   freshclam
   ```

## Usage

To run the Mac Security Protocol CLI:

```
node main.js
```

For a dry run without actually executing the security tools (mock mode):

```
node main.js --mock
```

Follow the on-screen prompts to select which security tools you want to run. The application will guide you through the process and provide real-time updates as each tool executes.

## Features
- Sequential execution of security tools
- Real-time progress updates
- Ability to abort running processes
- Detailed logging and reporting
- Mock mode for testing and demonstration

## Caution
Some of the security tools may require elevated privileges to run effectively. Always ensure you understand the implications of running these tools on your system. This CLI is intended for use on personal or authorized systems only.

## Contributing
Contributions to improve the Mac Security Protocol CLI are welcome. Please feel free to submit pull requests or open issues to suggest improvements or report bugs.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer
This tool is provided as-is, without any guarantees or warranty. The authors are not responsible for any damage or data loss that may occur from the use of this tool. Always backup your important data before performing security audits or system changes.
