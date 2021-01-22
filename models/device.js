var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deviceSchema = new Schema({
    uid: String,
    devicetoken : String
});
module.exports = mongoose.model('device', deviceSchema); // when call module by require, this function is executed