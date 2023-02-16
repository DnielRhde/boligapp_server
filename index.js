var express = require('express');
var app = express();
const { MongoClient } = require("mongodb");


// Connect to MongoDB
const client = new MongoClient("mongodb://localhost:27017/");
client.connect();
client.db("DATA").command({ ping: 1 });
console.log("Connected successfully to server");


async function getnearme(x,y) {
  var findResult = "No documents where found";
  try {
    findResult = await client.db("DATA").collection("FINAL").find(
      {"jordstykker.centroide.geometri": {"$within": {"$center": [[parseFloat(x), parseFloat(y)], 150]}}}
    );
  } finally {
    return(findResult);
  }
}


app.get("/api", async function(req, res) {
  const getnearmeRes = await getnearme(req.query.x, req.query.y);
  var nearmeArr = [];
  await getnearmeRes.forEach(element => {
    nearmeArr.push(element);
  });
  console.log("okayyyy");
  res.send(nearmeArr);
});


app.listen(3000, () => {
  console.log(`Server Started at ${3000}`)
})