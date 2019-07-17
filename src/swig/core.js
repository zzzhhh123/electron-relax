const swig = require('swig-templates');
const fs = require('fs');
const { staticTag, viewsTag } = require('./plugins');

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