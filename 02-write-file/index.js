const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');

const stream = fs.createWriteStream(filePath);
process.stdout.write('You can write something here.\n');
process.stdin.on('data', (data) => {
  let text = data.toString();
  if (text.trim().toLowerCase() === 'exit') {
    process.exit();
  } else {
    stream.write(text + '\n');
  }
});
process.on('exit', () => {
  process.stdout.write('\nBye!\n');
});
process.on('SIGINT', () => {
  process.stdout.write('\nBye!\n');
});
