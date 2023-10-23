'use strict';

require('./src/client/helper');
var logs = require('./src/client/logs');
var myserver = require('./src/client/myserver');
var westonapi = require('./src/client/westonapi');
var apn = require('./src/client/apn');

exports.init = function()
{
    
}

exports.createLogger = logs.createLogger;
exports.resetLogger = logs.reset;
exports.myserver = myserver;
exports.westonapi = westonapi;
exports.apn = apn;

exports.test =  function () {
    return "Hello world2";
}