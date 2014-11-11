'use strict';

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var path = require('path');
var proxyquire =  require('proxyquire');


describe('-- tests --', function () {
    var detectorStub, caseify, streamErrorSpy;

    beforeEach(function () {
        streamErrorSpy = sinon.spy();
        detectorStub = sinon.stub();
        caseify = proxyquire('../', { 'detect-invalid-requires': detectorStub });
    });

    afterEach(function () { });

    function setupTest(name, returnFromDetector) {
        var stream = caseify(path.join(__dirname, name, 'index.js'));
        stream.write('');
        stream.on('error', streamErrorSpy);
        detectorStub.callArgWith(2, returnFromDetector || []);
    }

    function generateInvalid(someFilePath) {
        return [{file: someFilePath || '', path: ''}];
    }

    describe('No config', function () {
        describe('is Valid', function () {
            it('must not log any errors', function () {
                setupTest('noconfig');
                expect(streamErrorSpy).to.not.have.been.called;
            });
        });
        describe('is Invalid', function () {
            it('must log any errors', function () {
                setupTest('noconfig', generateInvalid());
                expect(streamErrorSpy).to.have.been.called;
            });
            it('must log out absolute paths', function () {
                setupTest('noconfig', generateInvalid('/some/file/path'));
                expect(streamErrorSpy).to.have.been.calledWithMatch('/some/file/path');
            });
        });
    });

    describe('Empty config', function () {
        describe('is Valid', function () {
            it('must not log any errors', function () {
                setupTest('noconfig');
                expect(streamErrorSpy).to.not.have.been.called;
            });
        });
        describe('is Invalid', function () {
            it('must log any errors', function () {
                setupTest('noconfig', generateInvalid());
                expect(streamErrorSpy).to.have.been.called;
            });
            it('must log out absolute paths', function () {
                setupTest('noconfig', generateInvalid('/some/file/path'));
                expect(streamErrorSpy).to.have.been.calledWithMatch('/some/file/path');
            });
        });
    });

    describe('Should throw', function () {
        describe('is Valid', function () {
            it('must not throw or log any errors', function () {
                expect(function () { setupTest('shouldthrow'); }).to.not.throw(Error);
                expect(streamErrorSpy).to.not.have.been.called;
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
                expect(streamErrorSpy).to.not.have.been.called;
            });
        });
        describe('is Invalid', function () {
            it('must log any errors', function () {
                setupTest('relativepaths', generateInvalid());
                expect(streamErrorSpy).to.have.been.called;
            });
            it('must log out relative paths', function () {
                setupTest('noconfig', generateInvalid(path.join(__dirname, 'relativepaths', 'index.js')));
                expect(streamErrorSpy).to.have.been.calledWithMatch(path.join('relativepaths', 'index.js'));
            });
        });
    });
});
