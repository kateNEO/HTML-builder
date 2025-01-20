const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const pathOriginalFile = path.join(__dirname, 'files');
  const pathCopyFile = path.join(__dirname, 'files-copy');
  try {
    await fs.rm(pathCopyFile, { recursive: true, force: true });
    await fs.mkdir(pathCopyFile, { recursive: true });
    const filesForCopy = await fs.readdir(pathOriginalFile, {
      withFileTypes: true,
    });
    // console.log(filesForCopy);
    filesForCopy.forEach((file) => {
      let originalFile = path.join(pathOriginalFile, file.name);
      let copyFile = path.join(pathCopyFile, file.name);
      fs.copyFile(originalFile, copyFile);
    });
  } catch (err) {
    console.error(err);
  }
}
copyDir();
