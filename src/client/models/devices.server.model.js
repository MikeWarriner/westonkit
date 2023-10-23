'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Light Schema
 */
var DevicesSchema = new Schema({
  updated: {
    type: Date,
    default: Date.now
  },
  deviceID: {
    type: String
  },
  apnID: {
    type: String
  },
  email:{
    type: String
  }
});

//var safesave = require(require('path').resolve('./modules/mongo.safesave'));
//SceneSchema.plugin(safesave);

// Unload model if OFFLINE
if (process.env.IS_OFFLINE) {
	delete mongoose.connection.models.Devices;
}

exports.Devices = mongoose.model('Devices', DevicesSchema);


