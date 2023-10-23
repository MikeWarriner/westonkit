'use strict';


var mongoose = require('mongoose');
var logger = require('./logs').createLogger('server', ['Server', 'WestonPark', 'Home']);
var Devices = require('./models/devices.server.model').Devices;
var db = require('./db');


const { v4: uuidv4 } = require('uuid');

var admin = require("firebase-admin");

exports.initialize = function(serviceAccountProduction)
{
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountProduction),
        databaseURL: "https://api-project-117891215821.firebaseio.com"
    });
}

exports.sendNotification = async function (payload) {

    var options = {
        priority: "normal",
        timeToLive: 60, // * 60,
        content_available: true // Required to allow data messages to get sent in latest sdk
    };

    logger.info("Sending payload " + JSON.stringify(payload));
    var count = 0;

    await db.connectToDatabase();

    var devices = await Devices.find().sort('-updated').exec(); //distinct('apnID').exec();
    for (var idx in devices) {
        var device = devices[idx];

        var ok = true;
        if (!(device && device.email && device.apnID))
            ok = false;

        if (!(device.email == "mikewarriner@gmail.com" || device.email == "mike@warriner.org"))
            ok = false;

        if (ok) {
            logger.info("send notification reg:" + device.updated + " to:" + device.email + "  " + device.apnID);
            try {
                var msgid = await admin.messaging().sendToDevice(device.apnID, payload, options);
                console.log(msgid);
                console.log(JSON.stringify(msgid));
                count = count + 1;
            } catch (error) {
                logger.error("sendNotification(Firebase) error : ", error)
            }
        }
    }
    if (count == 0)
        logger.warn("Didn't find any devices to successfully notify");
}