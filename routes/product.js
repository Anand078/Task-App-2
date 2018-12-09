var express = require('express');
var router = express.Router();

var Product = require('../model/productDetails');

router.post('/add', function (req, res) {
    var product = new Product({
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        price: req.body.price,
        quantity: req.body.quantity,
        createdAt: new Date()
    });
    
            product.save(function(err, result) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                res.status(201).json({
                    message: 'product is saved successfully',
                    obj: result
                });
            });
});

router.post('/edit/:name', (req, res) => {
    const where = {
        productName: req.params.name
    };
    const updateData = {
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        price: req.body.price,
        quantity: req.body.quantity
    };
    Product.findOneAndUpdate(where, updateData, (err, user) => {
        if (err) {
            return res
                .status(500)
                .send({error: "unsuccessful"})
        };
        res.send({success: "success"});
    });

});

router.delete('/delete/:name', function(req,res){
    const where = {
        productName: req.params.name
    };
    Product.remove(where, function (err, user) {
      if (err)
        return res.status(500).json({
            message: err.message || err.stack
        });

      console.log('User successfully removed from polls collection!');
      res.status(200).json({
          message: "successfully deleted"
      });
    });
});

    router.get('/getAllProducts', function (req, res){
        Product.find({},function(err, productList){
            if(err){
                res.status(500).json({
                    message: err.message || err.stack
                });
            }else{
                res.status(200).json({
                    "product-list": productList
                });
            }
        })
})

router.get('/getProductDetails/:id', (req, res) => {
    const where = {
        _id: req.params.id
    };
          Product.find(where, function(err, product){
            if(err) {
                console.log(err)
                res.status(500).json({
                    message: err.message || err.stack
                });
            }
            res.status(200).json(product)
    })
});

module.exports = router;