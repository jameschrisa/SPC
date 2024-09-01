// ... (previous code remains the same)

async function checkClamavDatabase() {
  try {
    await execAsync('freshclam');
    console.log('ClamAV virus database updated successfully.');
  } catch (error) {
    console.error('Error updating ClamAV virus database:');
    console.error(error.message);
    console.error('Attempting to create a basic configuration file...');
    
    try {
      await execAsync('sudo mkdir -p /opt/homebrew/etc/clamav');
      await execAsync('sudo touch /opt/homebrew/etc/clamav/freshclam.conf');
      await execAsync('echo "DatabaseMirror database.clamav.net" | sudo tee /opt/homebrew/etc/clamav/freshclam.conf');
      console.log('Created a basic configuration file. Attempting to update the database again...');
      
      await execAsync('freshclam');
      console.log('ClamAV virus database updated successfully after creating configuration.');
    } catch (configError) {
      console.error('Failed to create configuration or update database:');
      console.error(configError.message);
      console.error('Please ensure freshclam is installed and you have necessary permissions.');
      console.error('You may need to run the following commands manually:');
      console.error('sudo mkdir -p /opt/homebrew/etc/clamav');
      console.error('sudo touch /opt/homebrew/etc/clamav/freshclam.conf');
      console.error('echo "DatabaseMirror database.clamav.net" | sudo tee /opt/homebrew/etc/clamav/freshclam.conf');
      console.error('sudo freshclam');
      
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      return new Promise((resolve) => {
        readline.question('Press Enter to continue without updating ClamAV database, or type "exit" to quit: ', (answer) => {
          readline.close();
          if (answer.toLowerCase() === 'exit') {
            process.exit(1);
          }
          resolve();
        });
      });
    }
  }
}

// ... (rest of the code remains the same)
