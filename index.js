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

var RE_MEDIA_QUERY     = /(?:(only|not)?\s*([^\s\(\)]+)\s*and\s*)?(.+)?/i,
    RE_MQ_EXPRESSION   = /\(\s*([^\s\:\)]+)\s*(?:\:\s*([^\s\)]+))?\s*\)/,
    RE_MQ_FEATURE      = /^(?:(min|max)-)?(.+)/,
    RE_LENGTH_UNIT     = /(em|rem|px|cm|mm|in|pt|pc)?$/,
    RE_RESOLUTION_UNIT = /(dpi|dpcm|dppx)?$/;

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
            var captures = expression.match(RE_MQ_EXPRESSION),
                feature  = captures[1].toLowerCase().match(RE_MQ_FEATURE);

            return {
                feature : feature[0],
                modifier: feature[1],
                property: feature[2],
                value   : captures[2]
            };
        });

        return parsed;
    });
}

function toDecimal(ratio) {
    var decimal = Number(ratio),
        numbers;

    if (!decimal) {
        numbers = ratio.match(/^(\d+)\s*\/\s*(\d+)$/);
        decimal = numbers[1] / numbers[2];
    }

    return decimal;
}

function toDpi(resolution) {
    var value = parseFloat(length),
        units = String(length).match(RE_RESOLUTION_UNIT)[1];

    switch (units) {
        case 'dpcm': return value / 2.54;
        case 'dppx': return value * 96;
        default    : return value;
    }
}

function toPx(length) {
    var value = parseFloat(length),
        units = String(length).match(RE_LENGTH_UNIT)[1];

    switch (units) {
        case 'em' : return value * 16;
        case 'rem': return value * 16;
        case 'cm' : return value * 96 / 2.54;
        case 'mm' : return value * 96 / 2.54 / 10;
        case 'in' : return value * 96;
        case 'pt' : return value * 72;
        case 'pc' : return value * 72 / 12;
        default   : return value;
    }
}
