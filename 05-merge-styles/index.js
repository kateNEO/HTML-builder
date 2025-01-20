const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  const stylesDir = path.join(__dirname, 'styles');
  const newStylesFile = path.join(__dirname, 'project-dist', 'bundle.css');
  let cssRules = '';
  try {
    let styles = await fs.readdir(stylesDir, { withFileTypes: true });
    for (const file of styles) {
      if (file.isFile() && file.name.indexOf('css') >= 0) {
        let curPath = path.join(stylesDir, file.name);
        let data = await fs.readFile(curPath, 'utf-8');
        cssRules += data.toString();
      }
      await fs.writeFile(newStylesFile, cssRules);
    }
  } catch (err) {
    console.error(err);
  }
}
mergeStyles();
