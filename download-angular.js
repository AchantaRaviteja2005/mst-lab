const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directories if they don't exist
const libDir = path.join(__dirname, 'public', 'js', 'lib');
if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, { recursive: true });
}

// Function to download a file
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${destination}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

// Files to download
const files = [
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.3/angular.min.js',
    destination: path.join(libDir, 'angular.min.js')
  },
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.3/angular-route.min.js',
    destination: path.join(libDir, 'angular-route.min.js')
  }
];

// Download all files
Promise.all(files.map(file => downloadFile(file.url, file.destination)))
  .then(() => {
    console.log('All files downloaded successfully');
  })
  .catch((err) => {
    console.error('Error downloading files:', err);
  });