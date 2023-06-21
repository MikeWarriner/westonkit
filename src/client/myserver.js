'use strict';

const axios = require('axios');
const os = require('os');



function wrap(moduleName, data)
{
    var wrapper = {
        moduleName: moduleName,
        server: os.hostname()
       
    };

    if (data) {
        wrapper.data = data;
    }
    return wrapper;//JSON.stringify(wrapper);
}
exports.heartbeat = async function(server, moduleName, status)
{
    var url = server + '/heartbeat';

    var logData = {
        module: 'helvar', 
        server:os.hostname(), 
        status: status
        };

    await axios.post(url, logData);
    
    
}
exports.start = async function(server, moduleName)
{
    var url = server + '/log';

    var logData = {
        module: 'helvar', 
        server:os.hostname(), 
        level: 'INFO',
        message: "start",
        }

        await axios.post(url, logData);
        await exports.heartbeat(server, moduleName, "start");
    
}

exports.stop = async function(server, moduleName)
{
    var url = server + '/log';

    var logData = {
        module: 'helvar', 
        server:os.hostname(), 
        level: 'INFO',
        message: "stop",
        }

    await axios.post(url, logData);
    await exports.heartbeat(server, moduleName, "stop");
}



exports.exception = async function(server, moduleName, message, error)
{
    var url = server + '/log';
    var stack = null;
    if (error)
    stack = error.stack;

    var logData = {
        module: 'helvar', 
        server:os.hostname(), 
        level: 'EXCEPTION',
        message: message,
        data: { moduileName: moduleName, message:message, error:error, stack:stack}
        };

    await axios.post(url, logData);
    
    
}
exports.error = async function(server, moduleName, errorLevel, message, error)
{
    var url = server + '/log';

    var logData = {
        module: 'helvar', 
        server:os.hostname(), 
        level: 'ERROR',
        message: message,
        data: { errorLevel:errorLevel, moduileName: moduleName, message:message, error:error}
        };

    await axios.post(url, logData);
}
exports.showerrors = async function(server, moduleName, filter)
{
    var url = server + '/api/errors/show';

    return JSON.parse(await axios.get(url, wrap(moduleName, {filter:filter})));
}

exports.elexol = async function(server, moduleName, data)
{
    var url = server + '/elexol';

    return await axios.post(url, wrap(moduleName, data));
}
exports.test = async function(server, moduleName,data)
{
    var url = server + '/test';

    return await axios.post(url, wrap(moduleName, data));
}


exports.weather = async function(server, moduleName, data)
{
    var url = server + '/weather';

    return await axios.post(url, wrap(moduleName, data));
}


exports.canbus = async function(server, moduleName, data)
{
    var url = server + '/canbus';

    return await axios.post(url, wrap(moduleName, data));
}

// exports.query = async function(server, moduleName, data)
// {
//     var url = server + '/api/agent/query';
//     var r = await safe_request.get(url, null, wrap(moduleName, data));
//     return r;
// }


// exports.querykeys = async function(server, moduleName, data)
// {
//     var url =  server + '/api/agent/querykeys';
//     var r = await safe_request.put(url, null, wrap(moduleName, data));
//     return r;
// }


exports.watchDog = async function(server)
{
    var url =  server + '/api/watchdog';
    return await axios.post(url, {status:'helvar_watchdog', message:'Helvar watchdog message'});
}


// exports.showallblocks = async function(server)
// {
//     var url =  server + '/api/showallblocks';
//     return JSON.parse(await safe_request.get(url));
// }


// exports.showblock = async function(server, blockName)
// {
//     var url =  server + '/api/showblock/'+blockName;
//     return JSON.parse(await safe_request.get(url));
// }

// exports.querylights = async function(server)
// {
//     var url =server + '/api/querylights'
//     return JSON.parse(await safe_request.get(url));
// }

// exports.querylight = async function(server, filter)
// {
//     var url = server + '/api/querylight/'+filter;
//     return JSON.parse(await safe_request.get(url));
// }
