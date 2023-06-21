'use strict';

console.log("Helper initializing...");

function exitHandler(options, err) {
    console.log("Exit handler... " + options.why);
    if (err) {
        console.log(err);
        console.log(err.stack);
    }
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { why: 'exit', cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { why: 'SIGING', exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { why: 'uncaughtException', exit: true }));

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
})