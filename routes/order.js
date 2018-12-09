var express = require('express');
var router = express.Router();

var Order = require('../model/orderDetails');
var Product = require('../model/productDetails');

router.post('/add', function (req, res) {
    const id = req.body.id;
    const quantity = req.body.quantity;
    var order = new Order({
        prodId : req.body.id,
        prodName: req.body.productName,
        purchaserName: req.body.purchaserName,
        pQuantity: req.body.quantity
    });
    
    const where = {
        _id: id
    };
    Product.findOne(where, function(err, product){
        if(err) {
            res.status(500).json({
                message: err.message || err.stack
            });
        }
        else {
            if(product) {
                const productQuantity = product.quantity;
                if(productQuantity>=quantity){
                    order.save(function(err, result) {
                        if (err) {
                            return res.status(500).json({
                                title: 'An error occurred',
                                error: err
                            });
                        }
                        const updateData = {
                            "$inc": {
                                "quantity": -quantity
                            }
                        };
                        Product.findOneAndUpdate(where, updateData, function(err, updResult){
                            if(err) {
                                res.status(500).json({
                                    message: err.message || err.stack
                                });
                            }
                            else {
                                res.status(200).json({
                                    message: "Order placed"
                                });
                            }
                        });
                    });
                }
                else {
                    res.status(422).json({
                        message: "Out of stock"
                    });
                }
            }
            else {
                res.status(422).json({
                    message: "This product not existed"
                });
            }
        }
    });
});


router.get('/getAllOrders', function (req, res){
    Order.find({},function(err, orderList){
        if(err){
            res.status(500).json({
                message: err.message || err.stack
            });
        }else{
            res.status(200).json({
                "order-list": orderList
            });
        }
    })
})

router.get('/getOrderDetails/:name', (req, res) => {
    const where = {
        prodName: req.params.name
    };
          Order.find(where, function(err, order){
            if(err) {
                console.log(err)
                res.status(500).json({
                    message: err.message || err.stack
                });
            }
            res.status(200).json(order)
    })
});

router.post('/delete/:id', function (req, res) {
    const id = req.params.id;
    
    const where = {
        _id: id
    };
    Order.findOne(where, function(err, order){
        if(err) {
            console.log(err)
            res.status(500).json({
                message: err.message || err.stack
            });
        }
        else{
            if(order)
            {
                const Orderedquantity = order.pQuantity; 
                const pId = order.prodId
                    
                const updateData = {
                    "$inc": {
                        "quantity": Orderedquantity
                    }
                    };
                    const where1 = {
                        _id: pId
                    };
                    Product.findOneAndUpdate(where1, updateData, function(err, updResult){
                        if(err) {
                            res.status(500).json({
                                message: err.message || err.stack
                            });
                        }
                        else {
                            Order.findByIdAndRemove(req.params.id, function(err1, doc1) { 
                                if(err1){
                                    res.status(500).json({
                                        message: err1.message || err1.stack
                                    });
                                }
                                else{
                                res.status(200).json({
                                    message : "Order is removed successfully"
                                })
                            }
                              })
                        }
                    });
            }
            else{
                res.status(422).json({
                    message: "order not exists"
                });
            }
        }
    });
});

router.post('/edit/:id', (req, res) => {
    const where = {
        _id: req.params.id
    };
    Order.findOne(where, function(err, order){
        if(err) {
            res.status(500).json({
                message: "order does not exists"
            });
        }
        else{
            if(order){
                const Orderedquantity = req.body.pQuantity 
                const pId = order.prodId
                Product.findById(pId, function(err2, res2){
                    if(err){
                        res.status(500).json({
                            message : err.message || err.stack
                        })
                    }
                    else
                    {
                        var inStockQuantity
                        if(res2)
                        {
                            inStockQuantity = res2.quantity
                        }
                        const prevQuantity = order.pQuantity
                        const updateData1 = {
                            "$inc": {
                                "quantity": prevQuantity - Orderedquantity
                            }
                            };
                           
                        if(Orderedquantity > inStockQuantity)
                        {
                            res.status(422).json({
                                message: "Out of stock"
                            })
                        }
                        else{
                        Product.findByIdAndUpdate(pId, updateData1, (err3, user) => {
                            if (err) {
                                res.status(422).json({
                                    message: err3.message || err3.stack
                                })
                            };
                            const updateData2 = {
                                    "pQuantity": req.body.pQuantity
                                };
                            Order.findByIdAndUpdate(req.params.id, updateData2, (err4, res4) =>{
                                if(err4){
                                    res.status(422).json({
                                        message: err4.message || err4.stack
                                    })
                                }
                                else{
                                res.status(200).json({
                                    message: "Order with updated quantity is placed"
                                })
                            }
                            })
                        });
                        
                        
                    }
                }
                })
            }
        }
    });
});

module.exports = router;