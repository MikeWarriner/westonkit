const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
var westonkit = require('../../index');
var winston = require('winston');


describe('push test', async () => {
  let sandbox;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Call without initialization', async () => {

    // //const spyTransport = new winston.transports.SpyTransport();
    // var myspy = sinon.spy();
    // var logger = westonkit.createLogger("test", {spy: myspy});
    
    // logger.info("test");
    // expect(myspy.calledTwice).to.be.true;
    // expect(myspy.calledWithMatch({level: 'info', message: 'test'})).to.be.true;
  });
});
