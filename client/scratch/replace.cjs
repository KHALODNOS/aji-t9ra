const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('c:/Users/barim/Documents/PFE/client/src', function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('http://localhost:5000')) {
      let newContent = content
        // Handle backticks: `http://localhost:5000/api...` -> `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api...`
        .replace(/\`http:\/\/localhost:5000/g, '`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}')
        // Handle double quotes: "http://localhost:5000/api..." -> `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api...`
        .replace(/\"http:\/\/localhost:5000(.*?)\"/g, '`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}$1`')
        // Handle single quotes: 'http://localhost:5000/api...' -> `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api...`
        .replace(/'http:\/\/localhost:5000(.*?)'/g, '`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}$1`');
      
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
