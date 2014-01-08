/* global describe, it */
'use strict';

/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

var expect = require('chai').expect,
    doesMQMatch = require('../').match;

describe('mediaQuery.match()', function () {

    describe('Equality Check', function(){

        it('Orientation: should return true for a correct match (===)', function () {
            expect(doesMQMatch('(orientation: portrait)', {orientation: 'portrait' })).to.equal(true);
        });

        it('Orientation: should return false for an incorrect match (===)', function () {
            expect(doesMQMatch('(orientation: landscape)', {orientation: 'portrait' })).to.equal(false);
        });

        it('Scan: should return true for a correct match (===)', function () {
            expect(doesMQMatch('(scan: progressive)', {scan: 'progressive' })).to.equal(true);
        });

        it('Scan: should return false for an incorrect match (===)', function () {
            expect(doesMQMatch('(scan: progressive)', {scan: 'interlace' })).to.equal(false);
        });

        it('Width: should return true for a correct match', function(){
            expect(doesMQMatch('(width: 800px)', {width: 800})).to.equal(true);
        });

        it('Width: should return false for an incorrect match', function(){
            expect(doesMQMatch('(width: 800px)', {width: 900})).to.equal(false);
        });
    });

    describe('Length Check', function(){

        describe('Width', function () {
            it('should return true for a width higher than a min-width', function(){
                expect(doesMQMatch('(min-width: 48em)', {width: '80em'})).to.equal(true);
            });

            it('should return false for a width lower than a min-width', function(){
                expect(doesMQMatch('(min-width: 48em)', {width: '20em'})).to.equal(false);
            });

            it('should return false when no width value is specified', function(){
                expect(doesMQMatch('(min-width: 48em)', {resolution: 72})).to.equal(false);
            });
        });

        describe('Different Units', function () {
            it('should work with ems', function(){
                expect(doesMQMatch('(min-width: 500px)', {width: '48em'})).to.equal(true);
            });

            it('should work with rems', function(){
                expect(doesMQMatch('(min-width: 500px)', {width: '48rem'})).to.equal(true);
            });

            it('should work with cm', function(){
                expect(doesMQMatch('(max-height: 1000px)', {height: '20cm'})).to.equal(true);
            });

            it('should work with mm', function(){
                expect(doesMQMatch('(max-height: 1000px)', {height: '200mm'})).to.equal(true);
            });

            it('should work with inch', function(){
                expect(doesMQMatch('(max-height: 1000px)', {height: '20in'})).to.equal(false);
            });

            it('should work with pt', function(){
                expect(doesMQMatch('(max-height: 1000px)', {height: '850pt'})).to.equal(false);
            });

            it('should work with pc', function(){
                expect(doesMQMatch('(max-height: 1000px)', {height: '60pc'})).to.equal(true);
            });
        });

    });

    describe('Resolution Check', function(){

        it('should return true for a resolution match', function(){
            expect(doesMQMatch('(resolution: 50dpi)', {resolution: 50 })).to.equal(true);
        });

        it('should return true for a resolution higher than a min-resolution', function(){
            expect(doesMQMatch('(min-resolution: 50dpi)', {resolution: 72 })).to.equal(true);
        });

        it('should return false for a resolution higher than a max-resolution', function(){
            expect(doesMQMatch('(max-resolution: 72dpi)', {resolution: 300 })).to.equal(false);
        });

        it('should return false if resolution isnt passed in', function(){
            expect(doesMQMatch('(min-resolution: 72dpi)', {width: 300 })).to.equal(false);
        });

        it('should convert units properly', function(){
            expect(doesMQMatch('(min-resolution: 72dpi)', {resolution: '75dpcm' })).to.equal(false);
            expect(doesMQMatch('(resolution: 192dpi)', {resolution: '2dppx' })).to.equal(true);
        });
    });

    describe('Aspect Ratio Check', function(){

        it('should return true for an aspect-ratio higher than a min-aspect-ratio', function(){
            expect(doesMQMatch('(min-aspect-ratio: 4/3)', {'aspect-ratio': '16/9' })).to.equal(true);
        });

        it('should return false for an aspect-ratio higher than a max-aspect-ratio', function(){
            expect(doesMQMatch('(max-aspect-ratio: 4/3)', {'aspect-ratio': '16/9' })).to.equal(false);
        });

        it('should return false if aspect-ratio isnt passed in', function(){
            expect(doesMQMatch('(max-aspect-ratio: 72dpi)', {width: 300})).to.equal(false);
        });

        it('should work numbers', function(){
            expect(doesMQMatch('(min-aspect-ratio: 2560/1440)', {'aspect-ratio': 4/3 })).to.equal(false);
        });
    });

    describe('Grid/Color/Color-Index/Monochrome', function(){

        it('should return true for a correct match', function(){
            expect(doesMQMatch('(grid)', {grid: 1})).to.equal(true);
            expect(doesMQMatch('(color)', {color: 1})).to.equal(true);
            expect(doesMQMatch('(color-index: 3)', {'color-index': 3})).to.equal(true);
            expect(doesMQMatch('(monochrome)', {monochrome: 1})).to.equal(true);

        });

        it('should return false for an incorrect match', function(){
            expect(doesMQMatch('(grid)', {grid: 0})).to.equal(false);
            expect(doesMQMatch('(color)', {color: 0})).to.equal(false);
            expect(doesMQMatch('(color-index: 3)', {'color-index': 2})).to.equal(false);
            expect(doesMQMatch('(monochrome)', {monochrome: 0})).to.equal(false);
            expect(doesMQMatch('(monochrome)', {monochrome: 'foo'})).to.equal(false);
        });


    });


    describe('Type', function(){

        it('should return true for a correct match', function(){
            expect(doesMQMatch('screen', {type: 'screen'})).to.equal(true);
        });

        it('should return false for an incorrect match', function(){
            expect(doesMQMatch('screen and (color:1)', {type: 'tv', color: 1})).to.equal(false);
        });

        it('should return false for a media query without a type when type is specified in the value object', function(){
            expect(doesMQMatch('(min-width: 500px)', {type: 'screen'})).to.equal(false);
        });

        it('should return true for a media query without a type when type is not specified in the value object', function(){
            expect(doesMQMatch('(min-width: 500px)', {width: 700})).to.equal(true);
        });
    });

    describe('Not', function(){

        it('should return false when theres a match on a `not` query', function(){
            expect(doesMQMatch('not screen and (color)', {type: 'screen', color: 1})).to.equal(false);
        });

        it('should not disrupt an OR query', function(){
            expect(doesMQMatch('not screen and (color), screen and (min-height: 48em)', {type: 'screen', height: 1000})).to.equal(true);
        });

        it('should return false for when type === all', function(){
            expect(doesMQMatch('not all and (min-width: 48em)', {type: 'all', width: 1000})).to.equal(false);
        });

        it('should return true for inverted value', function(){
            expect(doesMQMatch('not screen and (min-width: 48em)', {width: '24em'})).to.equal(true);
        });
    });

    describe('#doesMQMatch() Integration Tests', function () {
        describe('Real World Use Cases (mostly AND)', function(){
            it('should return true because of width and type match', function(){
                expect(doesMQMatch('screen and (min-width: 767px)', {type: 'screen', width: 980})).to.equal(true);
            });

            it('should return true because of width is within bounds', function(){
                expect(doesMQMatch('screen and (min-width: 767px) and (max-width: 979px)', {type: 'screen', width: 800})).to.equal(true);
            });

            it('should return false because width is out of bounds', function(){
                expect(doesMQMatch('screen and (min-width: 767px) and (max-width: 979px)', {type: 'screen', width: 980})).to.equal(false);
            });

            it('should return false since monochrome is not specified', function(){
                expect(doesMQMatch('screen and (monochrome)', {width: 980})).to.equal(false);
            });

            it('should return true since color > 0', function(){
                expect(doesMQMatch('screen and (color)', {type: 'screen', color: 1})).to.equal(true);
            });

            it('should return false since color = 0', function(){
                expect(doesMQMatch('screen and (color)', {type: 'all', color: 0})).to.equal(false);
            });

        });

        describe('Grouped Media Queries (OR)', function(){
            it('should return true because of color', function(){
                expect(doesMQMatch('screen and (min-width: 767px), screen and (color)', {type: 'screen', color: 1})).to.equal(true);
            });

            it('should return true because of width and type', function(){
                expect(doesMQMatch('screen and (max-width: 1200px), handheld and (monochrome)', {type: 'screen', width: 1100})).to.equal(true);
            });

            it('should return false because of monochrome mis-match', function(){
                expect(doesMQMatch('screen and (max-width: 1200px), handheld and (monochrome)', {type: 'screen', monochrome: 0})).to.equal(false);
            });

        });
    });
});

