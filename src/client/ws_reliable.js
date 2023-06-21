
'use strict';
const WebSocket = require('ws');
var logger = require('./logs').getLogger();

var pingInterval = 60;
var heartBeatInterval = pingInterval * 2;
var pingTimeout = null;

var webSocket = null;
var wssServer;
var _onMessage;
var count = 0;
var errors = 0;
var pingcount = 0;
exports.startSocket = function (server, onMessage) {
    wssServer = server;
    _onMessage = onMessage;

    webSocketConnect();
}

exports.stopSocket = function () {
    webSocketDisconnect();
}

function webSocketConnect() {
    var ws = new WebSocket(wssServer);
    heartbeat();
    ws.on('open', heartbeat);
    //client.on('pong', heartbeat);
    ws.on('pong', function (data) { heartbeat(); })
    ws.on('close', function clear() {
        clearTimeout(pingTimeout);
    });
    ws.on('message', function (data) {

        (async () => {
            try {
                await _onMessage(data);
            } catch (e) {
                // Deal with the fact the chain failed
                console.log(e);
            }
        })();
    });

    webSocket = ws;
}
//
function webSocketDisconnect() {
    if (webSocket) {
        var w = webSocket;
        webSocket = null;
        w.terminate();
    }
}


function heartbeat() {
    logger.verbose("heartbeat HB_Count "+ count+" Ping = "+pingcount+" Error = "+errors);
    count++;
    clearTimeout(pingTimeout);

    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    pingTimeout = setTimeout(() => {
        try
        {
            logger.warn("Heartbeat FAILED - restart websocket");
            webSocketDisconnect();
            webSocketConnect();
            errors++;
        }
        catch (e)
        {
            logger.error("setTimeout exception", e);
        }
        //this.terminate();
    }, heartBeatInterval * 1000 + 1000);
}





const interval = setInterval(function ping() {
    //console.log("SetInterval firing");
    //webSocket.send("{command: ping}");
    try
    {
        if (webSocket.readyState==1)
        {
            webSocket.ping();
            pingcount++;
        }
        
        if (webSocket.readyState != 1)
            logger.warn("ws.readyState=" + webSocket.readyState);
        if (webSocket.readyState >1 ) {
            logger.warn("Restarting websocket, readyState is DEAD")
            webSocketDisconnect();
            webSocketConnect();
        }
//            logger.warn("webSocket is not ready (readyState="+webSocket.readyState+") - heartbeat ignored");
    }
    catch (e)
    {
        logger.error("setInterval exception", e);
    }

}, pingInterval * 1000);
