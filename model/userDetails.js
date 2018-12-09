var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userDetails = new Schema({
    fullName: {type: String, required: true},
    userName: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true}
},
    {timestamps : true}
);

module.exports = mongoose.model('User', userDetails);