var assert = require('chai').assert,
    doesMQMatch = require('../');


describe('#doesMQMatch()', function(){
    describe('Width', function(){
        it('should return true for a width higher than a min-width', function(){
            assert.equal(doesMQMatch('(min-width: 48em)', {width: '80em'}), true);
        });

        it('should return false for a width higher than a min-width', function(){
            assert.equal(doesMQMatch('(min-width: 48em)', {width: '20em'}), false);
        });

        it('should return true when no width values are passed in', function(){
            assert.equal(doesMQMatch('(min-width: 48em)', {resolution: 72}), true);
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

        it('should return true when no height values are passed in', function(){
            assert.equal(doesMQMatch('(min-height: 48em)', {resolution: 72}), true);
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

        it('should return true when no device-width values are passed in', function(){
            assert.equal(doesMQMatch('(min-device-width: 48em)', {resolution: 72}), true);
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

        it('should return true when no device-height values are passed in', function(){
            assert.equal(doesMQMatch('(min-device-height: 48em)', {resolution: 72}), true);
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

        it('should return true if color isnt passed in', function(){
            assert.equal(doesMQMatch('max-width: 767px and (color)', {width: 300}), true);
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

        it('should return true if color-index isnt passed in', function(){
            assert.equal(doesMQMatch('max-width: 767px and (color-index)', {width: 300}), true);
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

        it('should return true if monochrome isnt passed in', function(){
            assert.equal(doesMQMatch('max-width: 767px and (monochrome)', {width: 300}), true);
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

        it('should return true if resolution isnt passed in', function(){
            assert.equal(doesMQMatch('(max-resolution: 72dpi)', {width: 300}), true);
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

        it('should return true if aspect-ratio isnt passed in', function(){
            assert.equal(doesMQMatch('(max-aspect-ratio: 72dpi)', {width: 300}), true);
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

        it('should return true if orientation isnt passed in', function(){
            assert.equal(doesMQMatch('screen and (orientation: landscape)', {width: '50em' }), true);
        });
    });

    describe('Grid', function () {
        it('should return true for a correct match', function(){
            assert.equal(doesMQMatch('handheld and (grid)', {grid: true }), true);
        });

        it('should return true if grid isnt passed in', function(){
            assert.equal(doesMQMatch('tv and (grid)', {scan: 'interlace' }), true);
        });

        it('should return false if grid is explictly set to false', function(){
            assert.equal(doesMQMatch('tv and (grid)', {scan: 'interlace', grid: false }), false);
        });
    });
});
