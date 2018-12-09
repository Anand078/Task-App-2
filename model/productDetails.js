var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productDetails = new Schema({
    productName: {type: String, required: true},
    productDescription: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true}
},
    {timestamps : true}
);

module.exports = mongoose.model('Product', productDetails);