
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
const Users = db.collection('Users');

exports.addUser = async function addUser(user){
  await client.connect();
  await Users.insertOne(user);
  await client.close();
}

exports.findUser = async function findUser(email){
  await client.connect();
  const query = {email: email}
  var user = await Users.findOne(query);
  await client.close();
  return user;
}

exports.updateUser = async function updateUser(id, user){
  await client.connect();
  const filter = {_id: id};
  const query = {
    $set: user
  }
  const result = await Users.updateOne(filter, query);
  await client.close();
  console.log(result);
}

exports.deleteUser = async function deleteUser(email) {
  await client.connect();
  const query = { email: email };
  const result = await Users.deleteOne(query);
  await client.close();
  return result.deletedCount;
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    var db = client.db("admin");
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


