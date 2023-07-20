var products = require('./product.model')

exports.addProduct = async function (req, res, next){
    let title = req.body.title;
    let description = req.body.description;
    let price = req.body.price;
    let quantity = req.body.quantity;
    let categoryId = req.body.categoryId;
    let otherProp = req.body.otherProp;

    if (!title || !price || !quantity || !categoryId) {
        res.status(400).json("Invalid Data");
    } else {
        let product = {
            title: title,
            description: description,
            price: price,
            quantity: quantity,
            categoryId: categoryId,
            otherProp: otherProp
        }
        await products.addProduct(product);
        res.status(200).json("Product added successfully")
    }
}

exports.getAllProducts = async function(req, res, next){
    let fetchedproducts = await products.getAllProducts()
    res.status(200).json({products: fetchedproducts})
}

exports.updateProduct = async function(req, res, next){
    let id = req.body.id;
    let product = req.body.product;
    let productRetrieved = await products.findProduct(id);
    if (productRetrieved) {
        await products.updateProduct(id, product);
        res.status(200).json("Product updated successfully")
    }
    res.status(400).json("Product does not exists")
}

exports.deleteProduct = async function(req, res, next){
    let id = req.body.id;
    let count = await products.deleteProduct(id)
    if (count === 1) {
        res.status(200).json("Product deleted successfully")
    } else {
        res.status(400).json("Product does not exists")
    }
}