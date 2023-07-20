const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://localhost:27017";
const ObjectId = require('mongodb').ObjectId;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const db = client.db("admin");
const carts = db.collection('carts');
const orders = db.collection('orders');
const products = require('../product/product.model')



exports.createCart = async function(email){
    await client.connect();
    let response = await carts.insertOne({email: email, items: []});
    await client.close();
    
    return response.insertedId.toString();
}

exports.findCart = async function(email){
    await client.connect();
    const query = {email: email}
    let response = await carts.findOne(query);
    await client.close();
    return response? response : null;
}

exports.updateCart = async function(id, item){
    await client.connect();
    const filter = {"_id": ObjectId(id)};
    const query = {
        $addToSet: {
            items: {
                $each:[item]
            }
        }
    }
    console.log(query);
    const result = await carts.updateOne(filter, query);
    await client.close();
    console.log(result);
}

exports.deleteCart = async function(id){
    await client.connect();
    const query = { _id: id };
    const result = await carts.deleteOne(query);
    await client.close();
    return result.deletedCount;
}

exports.addOrder = async function(cart){
    await client.connect();
    let response = await orders.insertOne({email: cart.email, items: cart.items});
    await client.close();
    
    return response.insertedId.toString();
}

exports.checkoutCart = async function(email){
    await client.connect();
    const query = {email: email}
    let response = await carts.findOne(query);
    
    if (response && response?.items) {
        let items = response.items;
    console.log("Items in cart: ", items);
    let productsInCart = []
    for (let index = 0; index < items.length; index++) {
        const productId = items[index].id;
        console.log("ProductId: ", productId);
        let productRetrieved = await products.findProduct(productId)
        let afterDecrement = productRetrieved.quantity - items[index].count;
        if (afterDecrement >= 0) {
            productRetrieved.quantity = afterDecrement;
            productsInCart.push(productRetrieved);
            //await products.updateProduct(productRetrieved._id, {quantity: afterDecrement});
        } else {
            let tempProduct = {title: productRetrieved.title, availableQuantity: productRetrieved.quantity}
            return tempProduct;
        }
    }
    for (let index = 0; index < productsInCart.length; index++) {
        const item = productsInCart[index];
        await products.updateProduct(item._id, item);
    }

    const filter = { _id: response._id };
    
    const result = await carts.deleteOne(query);
    }else{
        return "Add items in cart to checkout"
    }
    
    await client.close();
    return response;
}

