/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

'use strict';

module.exports = matchMQ;

// -----------------------------------------------------------------------------

function matchMQ(mediaQuery, values) {
    //return parseQuery(mediaQuery);
    return doesMQMatch(mediaQuery, values);
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
    var value = parseFloat(resolution),
        units = String(resolution).match(RE_RESOLUTION_UNIT)[1];

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

function toDecimal(ratio) {
    var numbers = ratio.match(/^(\d+)\s*\/\s*(\d+)$/);
    return numbers[1] / numbers[2];
}

function doesMQMatch(mq, query) {

    //get the AST
    var parsed = parseQuery(mq),
        didMQMatch = true;

    parsed.forEach(function (p) {
        p.expressions.forEach(function (e) {
            //if the query contains this property, then we need to do a check to see if it passes the threshold. If any of the matches are false, then the media query does not pass.
            var match = checkForMatch(e, query);
            if (!match) {
                didMQMatch = false;
            }
        });
    });

    return didMQMatch;
}

function checkForMatch (exp, query) {
    var val = query[exp.property],
        isMatch = false;

    //if there's a value for this property, then we need to see if it is within the threshold
    //doing an explicit undefined check here so that `0` goes through.
    if (val !== undefined) {
        switch (exp.property) {
            case 'device-width':
            case 'device-height':
            case 'width':
            case 'height':
                isMatch = doesLengthPass(exp, val);
                break;

            case 'color':
            case 'color-index':
            case 'monochrome':
                isMatch = doesColorPass(exp, val);
                break;

            case 'resolution':
                isMatch = doesResolutionPass(exp, val);
                break;

            case 'aspect-ratio':
                isMatch = doesAspectRatioPass(exp, val);
                break;

            case 'orientation':
            case 'scan':
                isMatch = doesScanPass(exp, val);
                break;

            case 'grid':
                isMatch = doesGridPass(exp, val);
                break;

        }

        return isMatch;
    }

    //if there is not a value for the property, then we can return true.
    else {
        return true;
    }
}

function checkMinMax (expVal, queryVal, modifier) {
    switch (modifier) {
        case 'min':
            //if the value we want is greater than the minimum required, then it's true.
            if (expVal <= queryVal) {
                return true;
            }
            break;
        case 'max':
            //if the value we want is less than or equal to the maximum required, then it's true.
            if (expVal >= queryVal) {
                return true;
            }
            break;
        default:
            //sometimes we may not have a modifier. in this case, the value has to be an exact match.
            if (expVal === queryVal) {
                return true;
            }
            break;
    }

    return false;
}

function doesTypePass (parsed, value) {
    var type = (value instanceof 'string') ? value : 'object'
    if (parsed === value) {
        return true;
    }
    else {
        return false;
    }
}

function doesLengthPass (exp, val) {
    var expToPx = toPx(exp.value),
        valToPx = toPx(val);

    return checkMinMax(expToPx, valToPx, exp.modifier);
}

function doesColorPass (exp, val) {
    var expInt;

    //this is the (min-width: foo) and (color) use case, which means "any colored device"
    if (!exp.value) {
        if (val === 0) return false;
        else return true;
    }

    //assigning after exp.value `undefined` check.
    expInt = parseInt(exp.value);
    return checkMinMax(expInt, val, exp.modifier);

}

function doesResolutionPass (exp, val) {
    var expDpi = toDpi(exp.value),
        valDpi = (typeof val === 'string') ? toDpi(val) : val;

    return checkMinMax(expDpi, valDpi, exp.modifier);
}

function doesAspectRatioPass (exp, val) {
    var expDec = toDecimal(exp.value),
        valDec = (typeof val === 'string') ? toDecimal(val) : val;
    return checkMinMax(expDec, valDec, exp.modifier);
}

function doesScanPass (exp, val) {
    if (exp.value === val) {
        return true;
    }
    return false;
}

function doesGridPass (exp, val) {
    //the only way grid would return false is if we explicitly had {grid: <falsy val>} in our query object.
    return !!val;
}
