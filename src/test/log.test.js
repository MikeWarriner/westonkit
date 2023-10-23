const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
var westonkit = require('../../index');
var winston = require('winston');
var spyTransport = require('../client/spytransport');
describe('log test', async () => {
  let sandbox;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Can create and log something', async () => {
    westonkit.resetLogger();

    //const spyTransport = new winston.transports.SpyTransport();
    var myspy = sinon.spy();
    var logger = westonkit.createLogger("test", {spy: myspy});
    
    logger.info("test");
    expect(myspy.calledTwice).to.be.true;
    expect(myspy.calledWithMatch({level: 'info', message: 'test'})).to.be.true;
  });
});
