'use strict';
const winston = require('winston');
const os = require('os');
const { createLogger, format, transports } = require('winston');
//var { Loggly } = require('winston-loggly-bulk');
var fs = require('fs');
var util = require('util');

var consoleLog;
var currentLogger;
var _require = require('triple-beam'),
    SPLAT = _require.SPLAT;


const deepclone = require('deepclone')


const deepCloneSplat = format((info) => {
    const cloned = deepclone(info)
    return format.splat().transform(cloned)
})

const mySplat = format((info) => {
    //if (consoleLog) { consoleLog("mySplat:: STACK:: "+(info instanceof Error));}
    //if (consoleLog) { consoleLog("mySplat:: STACK:: "+(info.message instanceof Error));}
    //if (consoleLog) consoleLog(util.inspect(info, { depth: null }));
    var msg = info.message;
    var splat = info[SPLAT] || info.splat; // No need to process anything if splat is undefined

    if (!splat || !splat.length) {
        return info;
    }
    if (!(splat instanceof Array))
        splat = JSON.parse(splat);
    splat.unshift(msg);

    info.message = util.format.apply(util, splat);

    return info;
})



exports.reset = function()
{
    currentLogger = null;
}

exports.getLogger = function () {
    if (currentLogger==null)
        console.log("INTERNAL ERROR - CURRENT LOGGER IS NULL");
    return currentLogger;
}
exports.createLogger = function (serviceName, tags) {

    if (currentLogger) return currentLogger;
    const transportList = [];
    let formatters = winston.format.combine(
        winston.format.errors({ stack: true }),
        mySplat(),
        winston.format.label({
            label: '[' + serviceName + ']'
        }),
        winston.format.timestamp({
            format: "YY-MM-DD HH:mm:ss"
        }),
        //winston.format.splat(),
        //winston.format.metadata(),
        //deepCloneSplat(),
        
        //winston.format.metadata(),
        /*winston.format(info => {
            if (info.meta && info.meta instanceof Array) info[SPLAT].push(...info.meta);
            else if (info.meta) info[SPLAT].push(info.meta);
            return info;
        })(),*/
        winston.format.printf(info => {
            //if (consoleLog) consoleLog(util.inspect(info, { depth: null }));


            //if (consoleLog) consoleLog(util.inspect(info, { depth: null }));
            if (info.stack)
                return `${info.label}  ${info.timestamp}  ${info.level} : ${info.message}\n${info.stack}`;
            else
                return `${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`;
        }),
        winston.format.colorize({
            all: true
        }),

    );
    transportList.push(new (transports.Console)({ format: formatters }));

    if (tags && tags['spy'])
    {
    transportList.push(new winston.transports.SpyTransport({spy:tags['spy']}));
    }

    // if (os.hostname != "iPad.westonpark.com") {
    //     transportList.push(new transports.Loggly({
    //         token: "e2962cff-7d77-4bd7-b4f3-14c74b936625",
    //         subdomain: "westonpark",
    //         tags: tags,
    //         json: true
    //     }));
    // }

    const logger = winston.createLogger({
        level: 'verbose',
        format: winston.format.json(),
        defaultMeta: { service: serviceName },
        transports: transportList
    });


    
    if (!consoleLog) {
        consoleLog = console.log;
        console.log = function (...d) { //
            logger.verbose(util.format(...d));
        };
    }
    logger.exception = function(msg, exceptionObject)
    {
        if (exceptionObject)
        {
            if (exceptionObject.message)
                logger.error("EXCEPTION on "+msg+" "+exceptionObject.message+" "+exceptionObject.stack);
            else
                logger.error("EXCEPTION on "+msg+" "+exceptionObject);
        }
        else
        logger.error("EXCEPTION on "+msg+" (null)");
    }
    logger.info("Logger starting for service " + serviceName + " on " + os.hostname());

    currentLogger = logger;

    return logger;
}