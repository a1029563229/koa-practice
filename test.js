
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:root@cluster0-cdbso.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
