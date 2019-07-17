"use strict";

var viewsTag = require('./tag-views');

var path = require('path'); // eslint-disable-next-line no-magic-numbers


var viewsURL = path.resolve(__dirname, '../../../../views');

module.exports = function (swig) {
  swig.setExtension('views', function (input) {
    return path.join(viewsURL, input);
  });
  swig.setTag('views', viewsTag.parse, viewsTag.compile, viewsTag.ends, viewsTag.blockLevel);
};