'use strict';

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var path = require('path');
var proxyquire =  require('proxyquire');


describe('-- tests --', function () {
    var consoleSpy, detectorStub, caseify;

    beforeEach(function () {
        consoleSpy = sinon.stub(console, 'error').returns(function () {}); //why can't we simply spy on console.error?
        detectorStub = sinon.stub();
        caseify = proxyquire('../', { 'detect-invalid-requires': detectorStub });
    });

    afterEach(function () {
        consoleSpy.restore();
    });

    function setupTest(name, returnFromDetector) {
        caseify(path.join(__dirname, name, 'index.js')).write('');
        detectorStub.callArgWith(2, returnFromDetector || []);
    }

    function generateInvalid(someFilePath) {
        return [{file: someFilePath || '', path: ''}];
    }

    describe('No config', function () {
        describe('is Valid', function () {
            it('must not log any errors', function () {
                setupTest('noconfig');
                expect(consoleSpy).to.not.have.been.called;
            });
        });
        describe('is Invalid', function () {
            it('must log any errors', function () {
                setupTest('noconfig', generateInvalid());
                expect(consoleSpy).to.have.been.called;
            });
            it('must log out absolute paths', function () {
                setupTest('noconfig', generateInvalid('/some/file/path'));
                expect(consoleSpy).to.have.been.calledWithMatch('/some/file/path');
            });
        });
    });

    describe('Empty config', function () {
        describe('is Valid', function () {
            it('must not log any errors', function () {
                setupTest('noconfig');
                expect(consoleSpy).to.not.have.been.called;
            });
        });
        describe('is Invalid', function () {
            it('must log any errors', function () {
                setupTest('noconfig', generateInvalid());
                expect(consoleSpy).to.have.been.called;
            });
            it('must log out absolute paths', function () {
                setupTest('noconfig', generateInvalid('/some/file/path'));
                expect(consoleSpy).to.have.been.calledWithMatch('/some/file/path');
            });
        });
    });

    describe('Should throw', function () {
        describe('is Valid', function () {
            it('must not throw or log any errors', function () {
                expect(function () { setupTest('shouldthrow'); }).to.not.throw(Error);
                expect(consoleSpy).to.not.have.been.called;
            });
        });
        describe('is Invalid', function () {
            it('must throw error', function () {
                expect(function () { setupTest('shouldthrow', generateInvalid()); }).to.throw(Error);
            });
        });
    });

    describe('Relative paths', function () {
        describe('is Valid', function () {
            it('must not log any errors', function () {
                setupTest('relativepaths');
                expect(consoleSpy).to.not.have.been.called;
            });
        });
        describe('is Invalid', function () {
            it('must log any errors', function () {
                setupTest('relativepaths', generateInvalid());
                expect(consoleSpy).to.have.been.called;
            });
            it('must log out relative paths', function () {
                setupTest('noconfig', generateInvalid(path.join(__dirname, 'relativepaths', 'index.js')));
                expect(consoleSpy).to.have.been.calledWithMatch(path.join('relativepaths', 'index.js'));
            });
        });
    });
});
