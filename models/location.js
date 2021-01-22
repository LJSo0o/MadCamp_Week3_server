var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var locationSchema = new Schema({
    uid: String,
    location : [{latitude: Number, longitude:Number}]
});
module.exports = mongoose.model('locations', locationSchema); // when call module by require, this function is executed