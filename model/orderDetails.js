var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderDetails = new Schema({
    prodId : {type: String, required : true},
    prodName: {type: String, required: true},
    purchaserName: {type: String, required: true},
    pQuantity: {type: Number, required: true}
},{
    timestamps:true
});

module.exports = mongoose.model('Order', orderDetails);