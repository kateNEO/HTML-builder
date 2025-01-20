const fs = require('fs');
const path = require('path');
const pathToDir = path.join(__dirname, 'secret-folder');

fs.readdir(pathToDir, { withFileTypes: true }, (err, files) => {
  if (err) {
    process.stdout.write(err);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        let name = file.name.split('.').splice(0, 1).join('');
        let ext = file.name.split('.').splice(1, 1).join('');
        let size = 0;
        if (!name) {
          name = ext;
          ext = '';
        }
        fs.stat(`${pathToDir}/${file.name}`, (err, stats) => {
          if (err) {
            process.stdout.write(err);
          } else {
            size = stats.size;
            process.stdout.write(`${name} - ${ext} - ${size / 1024} Kb \n`);
          }
        });
      }
    });
  }
});
