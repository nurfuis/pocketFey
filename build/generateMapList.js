const fs = require('fs');
const path = require('path');

const BASE_DIR = './assets/maps';

const mapList = [];

function searchFiles(dirPath) {

  const files = fs.readdirSync(dirPath);

  for (const each of files) {
    const fullPath = path.join(dirPath, each);
    const stats = fs.lstatSync(fullPath);
    if (stats.isFile() && path.extname(fullPath) === '.tmj') {
      mapList.push(fullPath); // Add full path of the .tmj file
    } 
  }
}

searchFiles(BASE_DIR);

fs.writeFileSync('./assets/stored_maps.json', JSON.stringify(mapList, null, 2));
