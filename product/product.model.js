const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb://localhost:27017";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const db = client.db("admin");
const products = db.collection('products');

exports.getAllProducts = async function(){
    await client.connect();
    const query = {}
    var fetchedProducts = await products.findOne(query);
    await client.close();
    return fetchedProducts;
}

exports.addProduct = async function(product){
    await client.connect();
    await products.insertOne(product);
    await client.close();
}

exports.updateProduct = async function(id, product){
    await client.connect();
    const filter = {_id: id};
    const query = {
        $set: product
    }
    const result = await products.updateOne(filter, query);
    await client.close();
    console.log(result);
}

exports.findProduct = async function(id){
    await client.connect();
    
    const query = {"_id" : ObjectId(id)}
    var product = await products.findOne(query);
    console.log(query);
    await client.close();
    return product;
}

exports.deleteProduct = async function(id){
    await client.connect();
    const query = { _id: id };
    const result = await products.deleteOne(query);
    await client.close();
    return result.deletedCount;
}