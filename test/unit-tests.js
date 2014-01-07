var assert = require('chai').assert,
    doesMQMatch = require('../');

describe('#doesMQMatch() media `type`', function () {
    describe('Type', function(){
        it('should return true for a correct match', function(){
            assert.equal(doesMQMatch('screen and (color)', {type: 'screen', color: 1}), true);
        });

        it('should return true for when type === all', function(){
            assert.equal(doesMQMatch('screen and (min-width: 48em)', {type: 'all', width: 1000}), true);
        });

        it('should return false for an incorrect match', function(){
            assert.equal(doesMQMatch('screen and (min-width: 48em)', {type: 'handheld'}), false);
        });

        it('should return true when no type values are passed in', function(){
            assert.equal(doesMQMatch('screen and (min-width: 48em)', {width: 1000}), true);
        });
    });
});


describe('#doesMQMatch() `not` operator', function () {
    describe('Type', function(){
        it('should return false when it matches up', function(){
            assert.equal(doesMQMatch('not screen and (color)', {type: 'screen', color: 1}), false);
        });

        it('should not disrupt an OR query', function(){
            assert.equal(doesMQMatch('not screen and (color), screen and (min-height: 48em)', {type: 'screen', height: 1000}), true);
        });

        it('should return false for when type === all', function(){
            assert.equal(doesMQMatch('not all and (min-width: 48em)', {type: 'all', width: 1000}), false);
        });

        it('should return true for inverted value', function(){
            assert.equal(doesMQMatch('not screen and (min-width: 48em)', {width: '24em'}), true);
        });
    });
});

describe('#doesMQMatch() Media Features', function(){
    describe('Width', function(){
        it('should return true for a width higher than a min-width', function(){
            assert.equal(doesMQMatch('(min-width: 48em)', {width: '80em'}), true);
        });

        it('should return false for a width higher than a min-width', function(){
            assert.equal(doesMQMatch('(min-width: 48em)', {width: '20em'}), false);
        });

        it('should return false when no width values are passed in', function(){
            assert.equal(doesMQMatch('(min-width: 48em)', {resolution: 72}), false);
        });

        it('should return true with multiple properties', function(){
            assert.equal(doesMQMatch('(min-width: 48em) and (color)', {width: '60em'}), true);
        });

        it('should convert units properly', function(){
            assert.equal(doesMQMatch('(min-width: 30em) and (color)', {width: 1024}), true);
        });
    });

    describe('Height', function(){
        it('should return true for a height higher than a min-height', function(){
            assert.equal(doesMQMatch('(min-height: 48em)', {height: '80em'}), true);
        });

        it('should return false for a height higher than a min-height', function(){
            assert.equal(doesMQMatch('(min-height: 48em)', {height: '20em'}), false);
        });

        it('should return false when no height values are passed in', function(){
            assert.equal(doesMQMatch('(min-height: 48em)', {resolution: 72}), false);
        });

        it('should return true with multiple properties', function(){
            assert.equal(doesMQMatch('(min-height: 48em) and (color)', {height: '60em'}), true);
        });

        it('should convert units properly', function(){
            assert.equal(doesMQMatch('(min-height: 30em) and (color)', {height: 1024}), true);
        });
    });


    describe('Device-Width', function(){
        it('should return true for a device-width higher than a min-device-width', function(){
            assert.equal(doesMQMatch('(min-device-width: 48em)', {'device-width': '80em'}), true);
        });

        it('should return false for a device-width higher than a min-device-width', function(){
            assert.equal(doesMQMatch('(min-device-width: 48em)', {'device-width': '20em'}), false);
        });

        it('should return false when no device-width values are passed in', function(){
            assert.equal(doesMQMatch('(min-device-width: 48em)', {resolution: 72}), false);
        });

        it('should return true with multiple properties', function(){
            assert.equal(doesMQMatch('(min-device-width: 48em) and (color)', {'device-width': '60em'}), true);
        });

        it('should convert units properly', function(){
            assert.equal(doesMQMatch('(min-device-width: 30em) and (color)', {'device-width': 1024}), true);
        });
    });

    describe('Device-Height', function(){
        it('should return true for a device-height higher than a min-device-height', function(){
            assert.equal(doesMQMatch('(min-device-height: 48em)', {'device-height': '80em'}), true);
        });

        it('should return false for a device-height higher than a min-device-height', function(){
            assert.equal(doesMQMatch('(min-device-height: 48em)', {'device-height': '20em'}), false);
        });

        it('should return false when no device-height values are passed in', function(){
            assert.equal(doesMQMatch('(min-device-height: 48em)', {resolution: 72}), false);
        });

        it('should return true with multiple properties', function(){
            assert.equal(doesMQMatch('(min-device-height: 48em) and (color)', {'device-height': '60em'}), true);
        });

        it('should convert units properly', function(){
            assert.equal(doesMQMatch('(min-device-height: 30em) and (color)', {'device-height': 1024}), true);
        });
    });



    describe('Color', function () {
        it('should return true for a color higher than a min-color', function(){
            assert.equal(doesMQMatch('(min-color: 2)', {color: 3 }), true);
        });

        it('should return false for a color higher than a max-color', function(){
            assert.equal(doesMQMatch('(max-color: 2)', {color: 4 }), false);
        });

        it('should return false if color isnt passed in', function(){
            assert.equal(doesMQMatch('max-width: 767px and (color)', {width: 300}), false);
        });

        it('should work for undefined color values', function(){
            assert.equal(doesMQMatch('(color)', {color: 4 }), true);
            assert.equal(doesMQMatch('(color)', {color: 0 }), false);
        });
    });

    describe('Color-Index', function () {
        it('should return true for a color-index higher than a min-color-index', function(){
            assert.equal(doesMQMatch('(min-color-index: 1)', {'color-index': 256 }), true);
        });

        it('should return false for a color-index higher than a max-color-index', function(){
            assert.equal(doesMQMatch('(max-color-index: 256)', {'color-index': 512 }), false);
        });

        it('should return false if color-index isnt passed in', function(){
            assert.equal(doesMQMatch('max-width: 767px and (color-index)', {width: 300}), false);
        });

        it('should work for undefined color-index values', function(){
            assert.equal(doesMQMatch('(color-index)', {'color-index': 1 }), true);
            assert.equal(doesMQMatch('(color-index)', {'color-index': 0 }), false);
        });
    });


    describe('Monochrome', function () {
        it('should return true for a monochrome higher than a min-monochrome', function(){
            assert.equal(doesMQMatch('(min-monochrome: 1)', {monochrome: 3 }), true);
        });

        it('should return false for a monochrome higher than a max-monochrome', function(){
            assert.equal(doesMQMatch('(max-monochrome: 3)', {monochrome: 4 }), false);
        });

        it('should return false if monochrome isnt passed in', function(){
            assert.equal(doesMQMatch('max-width: 767px and (monochrome)', {width: 300}), false);
        });

        it('should work for undefined monochrome values', function(){
            assert.equal(doesMQMatch('(monochrome)', {'monochrome': 3 }), true);
            assert.equal(doesMQMatch('(monochrome)', {'monochrome': 0 }), false);
        });
    });


    describe('Resolution', function () {
        it('should return true for a resolution higher than a min-resolution', function(){
            assert.equal(doesMQMatch('(min-resolution: 50dpi)', {resolution: 72 }), true);
        });

        it('should return false for a resolution higher than a max-resolution', function(){
            assert.equal(doesMQMatch('(max-resolution: 72dpi)', {resolution: 300 }), false);
        });

        it('should return false if resolution isnt passed in', function(){
            assert.equal(doesMQMatch('(max-resolution: 72dpi)', {width: 300}), false);
        });

        it('should convert units properly', function(){
            assert.equal(doesMQMatch('(min-resolution: 72dpi)', {resolution: '75dpcm' }), false);
        });
    });

    describe('Aspect-Ratio', function () {
        it('should return true for an aspect-ratio higher than a min-aspect-ratio', function(){
            assert.equal(doesMQMatch('(min-aspect-ratio: 4/3)', {'aspect-ratio': '16/9' }), true);
        });

        it('should return false for an aspect-ratio higher than a max-aspect-ratio', function(){
            assert.equal(doesMQMatch('(max-aspect-ratio: 4/3)', {'aspect-ratio': '16/9' }), false);
        });

        it('should return false if aspect-ratio isnt passed in', function(){
            assert.equal(doesMQMatch('(max-aspect-ratio: 72dpi)', {width: 300}), false);
        });

        it('should work with strings and numbers', function(){
            assert.equal(doesMQMatch('(min-aspect-ratio: 2560/1440)', {'aspect-ratio': 4/3 }), false);
        });
    });

    describe('Scan', function () {
        it('should return true for a correct match', function(){
            assert.equal(doesMQMatch('tv and (scan: progressive)', {scan: 'progressive' }), true);
        });

        it('should return false for an incorrect match', function(){
            assert.equal(doesMQMatch('tv and (scan: progressive)', {scan: 'interlace' }), false);
        });
    });

    describe('Orientation', function () {
        it('should return true for a correct match', function(){
            assert.equal(doesMQMatch('screen and (orientation: portrait)', {orientation: 'portrait' }), true);
        });

        it('should return false for an incorrect match', function(){
            assert.equal(doesMQMatch('screen and (orientation: landscape)', {orientation: 'portrait' }), false);
        });

        it('should return false if orientation isnt passed in', function(){
            assert.equal(doesMQMatch('screen and (orientation: landscape)', {width: '50em' }), false);
        });
    });

    describe('Grid', function () {
        it('should return true for a correct match', function(){
            assert.equal(doesMQMatch('handheld and (grid)', {grid: true }), true);
        });

        it('should return false if grid isnt passed in', function(){
            assert.equal(doesMQMatch('tv and (grid)', {scan: 'interlace' }), false);
        });

        it('should return false if grid is explictly set to false', function(){
            assert.equal(doesMQMatch('tv and (grid)', {scan: 'interlace', grid: false }), false);
        });
    });
});

describe('#doesMQMatch() Integration Tests', function () {
    describe('Real World Use Cases (mostly AND)', function(){
        it('should return true because of width and type match', function(){
            assert.equal(doesMQMatch('screen and (min-width: 767px)', {type: 'screen', width: 980}), true);
        });

        it('should return true because of width is within bounds', function(){
            assert.equal(doesMQMatch('screen and (min-width: 767px) and (max-width: 979px)', {type: 'screen', width: 800}), true);
        });

        it('should return false because width is out of bounds', function(){
            assert.equal(doesMQMatch('screen and (min-width: 767px) and (max-width: 979px)', {type: 'screen', width: 980}), false);
        });

        it('should return false since monochrome is not specified', function(){
            assert.equal(doesMQMatch('screen and (monochrome)', {width: 980}), false);
        });

        it('should return true since color > 0', function(){
            assert.equal(doesMQMatch('screen and (color)', {type: 'all', color: 1}), true);
        });

        it('should return false since color = 0', function(){
            assert.equal(doesMQMatch('screen and (color)', {type: 'all', color: 0}), false);
        });

    });

    describe('Grouped Media Queries (OR)', function(){
        it('should return true because of color', function(){
            assert.equal(doesMQMatch('screen and (min-width: 767px), screen and (color)', {type: 'screen', color: 1}), true);
        });

        it('should return true because of width and type', function(){
            assert.equal(doesMQMatch('screen and (max-width: 1200px), handheld and (monochrome)', {type: 'screen', width: 1100}), true);
        });

        it('should return false because of monochrome mis-match', function(){
            assert.equal(doesMQMatch('screen and (max-width: 1200px), handheld and (monochrome)', {type: 'screen', monochrome: 0}), false);
        });

    });
});

