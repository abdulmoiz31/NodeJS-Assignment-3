const { MongoClient, ServerApiVersion } = require('mongodb');
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
const categories = db.collection('categories');

exports.getAllCategories = async function(){
    await client.connect();
    const query = {}
    var fetchedCategories = await categories.findOne(query);
    await client.close();
    return fetchedCategories;
}

exports.addCategory = async function(category){
    await client.connect();
    await categories.insertOne(category);
    await client.close();
}

exports.updateCategory = async function(id, category){
    await client.connect();
    const filter = {_id: id};
    const query = {
        $set: category
    }
    const result = await categories.updateOne(filter, query);
    await client.close();
    console.log(result);
}

exports.findCategory = async function(title){
    await client.connect();
    
    const query = {title: { $regex: title, $options: 'i' }}
    var category = await categories.find(query).toArray();
    await client.close();
    return category;
}

exports.deleteCategory = async function(id){
    await client.connect();
    const query = { _id: id };
    const result = await categories.deleteOne(query);
    await client.close();
    return result.deletedCount;
}