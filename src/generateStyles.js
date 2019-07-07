const fs = require('fs');

const HIGHLIGHTJS_STYLE_FOLDER_LOCATION = './node_modules/highlight.js/styles/';
const destinationJSFile = './src/highlightStyles.js';


fs.readdir(HIGHLIGHTJS_STYLE_FOLDER_LOCATION, (err, filenames) => {
    if (err) {
        console.log(err)
        return;
    }

    const styleNames = [];
    filenames.forEach((filename, i) => {
        // there are some images in the file which we ignore
        if (filename.endsWith('.css')) {
            // trim the .css off the name
            let styleName = filename.substring(0, filename.length - 4);

            // darkula is a typo that exists for legacy purposes and will not be used in this project
            if (styleName === 'darkula') return

            styleNames.push(`'${styleName}'`)
        }
        if (i === filenames.length - 1) {
            const finalString = `export default [\n${styleNames.join(',\n')}\n]`
            fs.writeFile(destinationJSFile, finalString, (err) => {
                if (err) throw err;
                console.log(`${destinationJSFile} written`)
            })
        }
    });
})
