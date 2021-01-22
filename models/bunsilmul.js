
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bunsilmulSchema = new Schema({
    uid: String,
    category: String,
    information: String,
    photo: String,
    latitude: Number,
    longitude: Number
});
module.exports = mongoose.model('bunsilmul', bunsilmulSchema); // when call module by require, this function is executed.