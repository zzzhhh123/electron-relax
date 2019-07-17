"use strict";

var swig = require('swig-templates');

var fs = require('fs');

var _require = require('./plugins'),
    staticTag = _require.staticTag,
    viewsTag = _require.viewsTag;

staticTag(swig);
viewsTag(swig);

function renderFile(tp, data) {
  return swig.renderFile(tp, data);
}

function compile(template, view, data) {
  if (fs.existsSync(template)) {
    fs.writeFileSync(view, renderFile(template, data));
  }
}

module.exports = compile;