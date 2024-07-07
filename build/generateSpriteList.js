const fs = require('fs');

const imagePaths = fs.readdirSync('./assets/sprites')
    .filter(path => path.endsWith('.png'));

const imageList = imagePaths.reduce((acc, path) => {
    const key = path.replace('.png', '');
    acc[key] = './assets/sprites/' + path;
    return acc;
}, {});

// Write the image list to a JSON file:
fs.writeFileSync('./assets/image_list.json', JSON.stringify(imageList, null, 2));