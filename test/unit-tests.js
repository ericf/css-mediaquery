/* global describe, it */

'use strict';

var expect     = require('chai').expect,
    mediaQuery = require('../');

describe('mediaQuery.match()', function () {
    describe('Equality Check', function () {
        it('Orientation: should return true for a correct match (===)', function () {
            expect(mediaQuery.match(
                '(orientation: portrait)', {orientation: 'portrait'}
            )).to.be.true;
        });

        it('Orientation: should return false for an incorrect match (===)', function () {
            expect(mediaQuery.match(
                '(orientation: landscape)', {orientation: 'portrait'}
            )).to.be.false;
        });

        it('Scan: should return true for a correct match (===)', function () {
            expect(mediaQuery.match(
                '(scan: progressive)', {scan: 'progressive'}
            )).to.be.true;
        });

        it('Scan: should return false for an incorrect match (===)', function () {
            expect(mediaQuery.match(
                '(scan: progressive)', {scan: 'interlace'}
            )).to.be.false;
        });

        it('Width: should return true for a correct match', function () {
            expect(mediaQuery.match(
                '(width: 800px)', {width: 800}
            )).to.be.true;
        });

        it('Width: should return false for an incorrect match', function () {
            expect(mediaQuery.match(
                '(width: 800px)', {width: 900}
            )).to.be.false;
        });
    });

    describe('Length Check', function () {
        describe('Width', function () {
            it('should return true for a width higher than a min-width', function () {
                expect(mediaQuery.match(
                    '(min-width: 48em)', {width: '80em'}
                )).to.be.true;
            });

            it('should return false for a width lower than a min-width', function () {
                expect(mediaQuery.match(
                    '(min-width: 48em)', {width: '20em'}
                )).to.be.false;
            });

            it('should return false when no width value is specified', function () {
                expect(mediaQuery.match(
                    '(min-width: 48em)', {resolution: 72}
                )).to.be.false;
            });
        });

        describe('Different Units', function () {
            it('should work with ems', function () {
                expect(mediaQuery.match(
                    '(min-width: 500px)', {width: '48em'}
                )).to.be.true;
            });

            it('should work with rems', function () {
                expect(mediaQuery.match(
                    '(min-width: 500px)', {width: '48rem'}
                )).to.be.true;
            });

            it('should work with cm', function () {
                expect(mediaQuery.match(
                    '(max-height: 1000px)', {height: '20cm'}
                )).to.be.true;
            });

            it('should work with mm', function () {
                expect(mediaQuery.match(
                    '(max-height: 1000px)', {height: '200mm'}
                )).to.be.true;
            });

            it('should work with inch', function () {
                expect(mediaQuery.match(
                    '(max-height: 1000px)', {height: '20in'}
                )).to.be.false;
            });

            it('should work with pt', function () {
                expect(mediaQuery.match(
                    '(max-height: 1000px)', {height: '850pt'}
                )).to.be.false;
            });

            it('should work with pc', function () {
                expect(mediaQuery.match(
                    '(max-height: 1000px)', {height: '60pc'}
                )).to.be.true;
            });
        });

    });

    describe('Resolution Check', function () {
        it('should return true for a resolution match', function () {
            expect(mediaQuery.match(
                '(resolution: 50dpi)', {resolution: 50}
            )).to.be.true;
        });

        it('should return true for a resolution higher than a min-resolution', function () {
            expect(mediaQuery.match(
                '(min-resolution: 50dpi)', {resolution: 72}
            )).to.be.true;
        });

        it('should return false for a resolution higher than a max-resolution', function () {
            expect(mediaQuery.match(
                '(max-resolution: 72dpi)', {resolution: 300}
            )).to.be.false;
        });

        it('should return false if resolution isnt passed in', function () {
            expect(mediaQuery.match(
                '(min-resolution: 72dpi)', {width: 300}
            )).to.be.false;
        });

        it('should convert units properly', function () {
            expect(mediaQuery.match(
                '(min-resolution: 72dpi)', {resolution: '75dpcm'}
            )).to.be.false;

            expect(mediaQuery.match(
                '(resolution: 192dpi)', {resolution: '2dppx'}
            )).to.be.true;
        });
    });

    describe('Aspect Ratio Check', function () {
        it('should return true for an aspect-ratio higher than a min-aspect-ratio', function () {
            expect(mediaQuery.match(
                '(min-aspect-ratio: 4/3)', {'aspect-ratio': '16 / 9'}
            )).to.be.true;
        });

        it('should return false for an aspect-ratio higher than a max-aspect-ratio', function () {
            expect(mediaQuery.match(
                '(max-aspect-ratio: 4/3)', {'aspect-ratio': '16/9'}
            )).to.be.false;
        });

        it('should return false if aspect-ratio isnt passed in', function () {
            expect(mediaQuery.match(
                '(max-aspect-ratio: 72dpi)', {width: 300}
            )).to.be.false;
        });

        it('should work numbers', function () {
            expect(mediaQuery.match(
                '(min-aspect-ratio: 2560/1440)', {'aspect-ratio': 4 / 3}
            )).to.be.false;
        });
    });

    describe('Grid/Color/Color-Index/Monochrome', function () {
        it('should return true for a correct match', function () {
            expect(mediaQuery.match(
                '(grid)', {grid: 1}
            )).to.be.true;

            expect(mediaQuery.match(
                '(color)', {color: 1}
            )).to.be.true;

            expect(mediaQuery.match(
                '(color-index: 3)', {'color-index': 3}
            )).to.be.true;

            expect(mediaQuery.match(
                '(monochrome)', {monochrome: 1}
            )).to.be.true;
        });

        it('should return false for an incorrect match', function () {
            expect(mediaQuery.match(
                '(grid)', {grid: 0}
            )).to.be.false;

            expect(mediaQuery.match(
                '(color)', {color: 0}
            )).to.be.false;

            expect(mediaQuery.match(
                '(color-index: 3)', {'color-index': 2}
            )).to.be.false;

            expect(mediaQuery.match(
                '(monochrome)', {monochrome: 0}
            )).to.be.false;

            expect(mediaQuery.match(
                '(monochrome)', {monochrome: 'foo'}
            )).to.be.false;
        });
    });

    describe('Type', function () {
        it('should return true for a correct match', function () {
            expect(mediaQuery.match(
                'screen', {type: 'screen'}
            )).to.be.true;
        });

        it('should return false for an incorrect match', function () {
            expect(mediaQuery.match(
                'screen and (color:1)', {
                    type : 'tv',
                    color: 1
                }
            )).to.be.false;
        });

        it('should return false for a media query without a type when type is specified in the value object', function () {
            expect(mediaQuery.match(
                '(min-width: 500px)', {type: 'screen'}
            )).to.be.false;
        });

        it('should return true for a media query without a type when type is not specified in the value object', function () {
            expect(mediaQuery.match(
                '(min-width: 500px)', {width: 700}
            )).to.be.true;
        });
    });

    describe('Not', function () {
        it('should return false when theres a match on a `not` query', function () {
            expect(mediaQuery.match(
                'not screen and (color)', {
                    type : 'screen',
                    color: 1
                }
            )).to.be.false;
        });

        it('should not disrupt an OR query', function () {
            expect(mediaQuery.match(
                'not screen and (color), screen and (min-height: 48em)', {
                    type  : 'screen',
                    height: 1000
                }
            )).to.be.true;
        });

        it('should return false for when type === all', function () {
            expect(mediaQuery.match(
                'not all and (min-width: 48em)', {
                    type : 'all',
                    width: 1000
                }
            )).to.be.false;
        });

        it('should return true for inverted value', function () {
            expect(mediaQuery.match(
                'not screen and (min-width: 48em)', {width: '24em'}
            )).to.be.true;
        });
    });

    describe('#mediaQuery.match() Integration Tests', function () {
        describe('Real World Use Cases (mostly AND)', function () {
            it('should return true because of width and type match', function () {
                expect(mediaQuery.match(
                    'screen and (min-width: 767px)', {
                        type : 'screen',
                        width: 980
                    }
                )).to.be.true;
            });

            it('should return true because of width is within bounds', function () {
                expect(mediaQuery.match(
                    'screen and (min-width: 767px) and (max-width: 979px)', {
                        type : 'screen',
                        width: 800
                    }
                )).to.be.true;
            });

            it('should return false because width is out of bounds', function () {
                expect(mediaQuery.match(
                    'screen and (min-width: 767px) and (max-width: 979px)', {
                        type : 'screen',
                        width: 980
                    }
                )).to.be.false;
            });

            it('should return false since monochrome is not specified', function () {
                expect(mediaQuery.match(
                    'screen and (monochrome)', {width: 980}
                )).to.be.false;
            });

            it('should return true since color > 0', function () {
                expect(mediaQuery.match(
                    'screen and (color)', {
                        type : 'screen',
                        color: 1
                    }
                )).to.be.true;
            });

            it('should return false since color = 0', function () {
                expect(mediaQuery.match(
                    'screen and (color)', {
                        type : 'screen',
                        color: 0
                    }
                )).to.be.false;
            });
        });

        describe('Grouped Media Queries (OR)', function () {
            it('should return true because of color', function () {
                expect(mediaQuery.match(
                    'screen and (min-width: 767px), screen and (color)', {
                        type : 'screen',
                        color: 1
                    }
                )).to.be.true;
            });

            it('should return true because of width and type', function () {
                expect(mediaQuery.match(
                    'screen and (max-width: 1200px), handheld and (monochrome)', {
                        type : 'screen',
                        width: 1100
                    }
                )).to.be.true;
            });

            it('should return false because of monochrome mis-match', function () {
                expect(mediaQuery.match(
                    'screen and (max-width: 1200px), handheld and (monochrome)', {
                        type      : 'screen',
                        monochrome: 0
                    }
                )).to.be.false;
            });
        });
    });
});

