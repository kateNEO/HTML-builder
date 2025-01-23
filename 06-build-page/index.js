const fsProm = require('fs/promises');
const fs = require('fs');
const path = require('path');

const pathProjectDistDir = path.join(__dirname, 'project-dist');
const pathTemplateFile = path.join(__dirname, 'template.html');
const pathIndexFile = path.join(pathProjectDistDir, 'index.html');
const componentsDir = path.join(__dirname, 'components');
const pathStyles = path.join(__dirname, 'styles');
const pathAssetsDir = path.join(__dirname, 'assets');
const newPathAssetsDir = path.join(pathProjectDistDir, 'assets');

async function buildPage() {
  const writeStream = fs.createWriteStream(pathIndexFile);
  try {
    await fsProm.mkdir(pathProjectDistDir, { recursive: true });
    await fsProm.copyFile(pathTemplateFile, pathIndexFile);
    const componentsList = await fsProm.readdir(componentsDir);
    // for (const file of componentsList) {
    console.log(componentsList);
    let newHtml = '';
    let contentHtml = await fsProm.readFile(pathIndexFile, 'utf-8');
    for (let i = 0; i < componentsList.length; i++) {
      let nameComponent = componentsList[i].split('.').splice(0, 1).join('');
      const contentComponent = await fsProm.readFile(
        path.join(componentsDir, componentsList[i]),
      );
      let removePart = `{{${nameComponent}}}`;
      newHtml = contentHtml.replace(removePart, contentComponent.toString());
      contentHtml = newHtml;
      // writeStream.
    }
    writeStream.write(newHtml);
  } catch (err) {
    console.error(err);
  }
}
async function mergeStyles() {
  const pathNewStyle = path.join(pathProjectDistDir, 'style.css');
  let cssRules = '';
  try {
    const stylesList = await fsProm.readdir(pathStyles, {
      withFileTypes: true,
    });
    for (const style of stylesList) {
      if (style.isFile() && style.name.indexOf('css') >= 0) {
        let curPath = path.join(pathStyles, style.name);
        let content = await fsProm.readFile(curPath, 'utf-8');
        cssRules += content;
      }
      await fsProm.writeFile(pathNewStyle, cssRules);
    }
  } catch (err) {
    console.error(err);
  }
}
async function mkDir(path) {
  try {
    await fsProm.mkdir(path, { recursive: true });
  } catch (err) {
    console.error(err);
  }
}
let p = '';
let pOrig = '';
async function copyAssets(currentDir) {
  try {
    const filesToCopyList = await fsProm.readdir(currentDir, {
      withFileTypes: true,
    });
    for (const item of filesToCopyList) {
      if (!item.isFile()) {
        p = path.join(newPathAssetsDir, item.name);
        pOrig = path.join(currentDir, item.name);
        await mkDir(p, { recursive: true });
        await copyAssets(pOrig);
      } else {
        await fsProm.copyFile(
          path.join(pOrig, item.name),
          path.join(p, item.name),
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
}

buildPage();
mergeStyles();
mkDir(newPathAssetsDir);
copyAssets(pathAssetsDir);
