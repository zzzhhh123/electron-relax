"use strict";

var staticTag = require('./tag-static');

var path = require('path'); // eslint-disable-next-line no-magic-numbers


var staticURL = path.resolve(__dirname, '../../../../dist');

module.exports = function (swig) {
  swig.setExtension('static', function (input) {
    var inputPath = input,
        output = inputPath;
    var isCss = /(\.(scss|css))$/.test(inputPath);

    if (isCss) {
      inputPath = inputPath.replace(/(\.scss)$/, '.css');
    }

    output = path.join(staticURL, inputPath);
    return output;
  });
  swig.setTag('static', staticTag.parse, staticTag.compile, staticTag.ends, staticTag.blockLevel);
};