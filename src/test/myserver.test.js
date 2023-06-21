const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
var westonkit = require('../../index');



describe('myserver test', async () => {
  let sandbox;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Can call westonapi', async () => {
    westonkit.myserver.test("https://api.westonpark.com");
  });
});
