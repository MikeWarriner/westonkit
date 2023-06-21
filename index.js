'use strict';

require('./src/client/helper');
var logs = require('./src/client/logs');
var myserver = require('./src/client/myserver');
var myserver = require('./src/client/westonapi');


exports.init = function()
{
    
}

exports.createLogger = logs.createLogger;
exports.myserver = myserver;
exports.westonapi = westonapi;

exports.test =  function () {
    return "Hello world2";
}