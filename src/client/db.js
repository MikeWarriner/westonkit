'use strict';
const mongoose = require('mongoose');

require('./models/devices.server.model.js');


var logger = require('./logs').createLogger('server', ['Server', 'WestonPark', 'Home', 'MongoDB']);

mongoose.Promise = global.Promise;
let isConnected;

exports.disconnect = () => {
    if (isConnected) {
        isConnected = false;
        return mongoose.connection.close();
        //return mongoose.disconnect();
    } else
        return Promise.resolve();
}


exports.connectToDatabase = () => {
    //var lib = require('require-all')('/Users/mike/Projects/WestonPark/WestonLambda/helvar/server/models');
    //var lib = require('require-all')('./models');

    mongoose.set('bufferCommands', false);
    //mongoose.set('useFindAndModify', false);

    if (isConnected) {
        //logger.verbose('connectToDatabase : using existing MongoDB connection');
        return Promise.resolve();
    }

    logger.info('connectToDatabase : opening new MongoDB connection');
    mongoose.set('strictQuery', false);
    if (!process.env.DB)
        throw "Process.env.DB is null";

    logger.info('Mongoose Connect to '+process.env.DB);
    return mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
            connectTimeoutMS: 5000,
            socketTimeoutMS: 10000
        })
        .then(db => {
            isConnected = db.connections[0].readyState;
            logger.info("MongoDB Connect : " + isConnected);
            if (!isConnected)
                logger.error("Connect returned isConnected = " + isConnected);
            else
                mongoose.set('debug', false);
        })
        .catch(error => logger.error("MongoConnectError", error));
};