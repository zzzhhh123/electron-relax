// eslint-disable-next-line max-params
exports.parse = function (str, line, parser, types, options) {
    let matched = false;

    parser.on('*', function (token) {
        if (matched) {
            throw new Error('Unexpected token ' + token.match + '.');
        }
        matched = true;

        return true;
    });

    return true;
};

// eslint-disable-next-line max-params
exports.compile = function (compiler, args, content, parents, options, blockName) {
    return '_output += _ext.views(' + args[0] + ');';
};

exports.ends = false;
exports.blockLevel = false;
