const staticTag = require('./tag-static');
const path = require('path');

// eslint-disable-next-line no-magic-numbers
const staticURL = path.resolve(__dirname, '../../../../assets');

module.exports = function (swig) {
    swig.setExtension('static', function (input) {
        let inputPath = input,
            output = inputPath;

        const isCss = (/(\.(scss|css))$/).test(inputPath);

        if (isCss) {
            inputPath = inputPath.replace(/(\.scss)$/, '.css');
        }

        output = path.join(staticURL, inputPath);

        return output;
    });

    swig.setTag('static', staticTag.parse, staticTag.compile, staticTag.ends, staticTag.blockLevel);
};
