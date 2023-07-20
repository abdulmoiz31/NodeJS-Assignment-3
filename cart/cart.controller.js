var carts = require('./cart.model')
var mailer = require('../mailer/mailer')

exports.createCart = async function (req, res, next){
    let cart = await carts.findCart(req.user.email)
    let cartId = cart?._id;

    if (cartId) {
        res.status(200).json({cartId: cartId, items: cart.items});
    } else {
        cartId = await carts.createCart(req.user.email);
        res.status(200).json({cartId: cartId, items: []});
    }
}

exports.updateCart = async function(req, res, next){
    let item = req.body.item;
    let cart = await carts.findCart(req.user.email)
    let cartId = cart?._id;
    if (!cartId) {
        cartId = await carts.createCart(req.user.email);
    }
    console.log(item);
    let response = await carts.updateCart(cartId, item);
    res.status(200).json("Items added in cart");
}

exports.deleteCart = async function(req, res, next){
    let cart = await carts.findCart(req.user.email)
    let cartId = cart?._id;
    if (!cartId) {
        res.status(400).json("User cart does not exists");
    }
    let count = await carts.deleteCart(cartId);
    if (count === 1) {
        res.status(200).json("User cart deleted successfully");
    }else{
        res.status(400).json("User cart does not exists");
    }   
}

exports.checkout = async function(req, res, next){
    let response = await carts.checkoutCart(req.user.email)
    if (response?.email) {
        let orderId = await carts.addOrder(response);
        await mailer.sendMail(req.user.email, "Order Placed Successfully", `Your Order with id ${orderId} is received and is under process.`)
        res.status(200).json({success: true, message: "Order Placed", orderId: orderId}) 
        
    }else{
        response?.availableQuantity ? res.status(400).json({success: false, checkoutFailedProduct: response}) : res.status(400).json({success: false, message: response})
        
    }
}