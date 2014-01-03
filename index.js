/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

'use strict';

module.exports = match;

// -----------------------------------------------------------------------------

function match(mediaQuery, values) {
    return parseQuery(mediaQuery);
}

// -- Utilities ----------------------------------------------------------------

var RE_MEDIA_QUERY   = /(?:(only|not)?\s*([^\s\(\)]+)\s*and\s*)?(.+)?/i,
    RE_MQ_EXPRESSION = /\(\s*([^\s\:\)]+)\s*(?:\:\s*([^\s\)]+))?\s*\)/,
    RE_LENGTH_VALUE  = /(\d+)(em|rem|px|cm|mm|in|pt|pc)?/;

function parseQuery(mediaQuery) {
    return mediaQuery.split(',').map(function (query) {
        var captures    = query.match(RE_MEDIA_QUERY),
            modifier    = captures[1],
            type        = captures[2],
            expressions = captures[3],
            parsed      = {};

        parsed.only = !!modifier && modifier.toLowerCase() === 'only';
        parsed.not  = !!modifier && modifier.toLowerCase() === 'not';
        parsed.type = type ? type.toLowerCase() : 'all';

        // Split expressions into a list.
        expressions = expressions.match(/\([^\)]+\)/g);

        parsed.expressions = expressions.map(function (expression) {
            var captures = expression.match(RE_MQ_EXPRESSION);

            return {
                feature: captures[1].toLowerCase(),
                value  : captures[2]
            };
        });

        return parsed;
    });
}

function toPx(length) {
    var captures = String(length).match(RE_LENGTH_VALUE),
        value    = Number(captures[1]),
        units    = captures[2];

    switch (units) {
        case 'em':
        case 'rem':
            return value * 16;
        case 'cm':
            return value * 96 / 2.54;
        case 'mm':
            return value * 96 / 2.54 / 10;
        case 'in':
            return value * 96;
        case 'pt':
            return value * 72;
        case 'pc':
            return value * 72 / 12;
        default:
            return value;
    }
}
