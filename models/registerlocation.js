var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var registerlocationSchema = new Schema({
    uid: String,
    location : [{latitude: Number, longitude:Number}]
});
module.exports = mongoose.model('registerlocation', registerlocationSchema); // when call module by require, this function is executed