const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

//App used
const app = express();
app.use(cors());
app.use(bodyParser.json());

//set username and password protectively
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const uri = process.env.DB_PATH;

//Create a connection with MongoClient
let client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Route File for Home directory
app.get("/", (req, res) => {
  res.send(
    "<h1 style='color:green;text-align:center;margin-top:20px'>Welcome To The Red Onion Restaurant Backend Side</h1>"
  );
});

//Add new Products into the database
app.post("/addfood", (req, res) => {
  const food = req.body;
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("redOnionRestaurant").collection("foods");
    collection.insertMany(food, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops);
        console.log("Inserted foods successfully..");
      }
    });
  });
});

//Get All Food Items Form Database
app.get("/foods", (req, res) => {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("redOnionRestaurant").collection("foods");
    collection.find().toArray((err, document) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(document);
        console.log("Foods is get successfully from database");
      }
    });
  });
});

//Find Food Item by id (single food)
app.get("/singlefood/:id", (req, res) => {
  const foodId = Number(req.params.id);
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("redOnionRestaurant").collection("foods");
    collection.find({ id: foodId }).toArray((err, document) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(document[0]);
        console.log("Single Foods is get successfully from database");
      }
    });
  });
});

//delete food items
app.delete("/foods/delete/:id", (req, res) => {
  const foodId = Number(req.params.id);
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("redOnionRestaurant").collection("foods");
    collection.deleteOne({ id: foodId }).toArray((err, document) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(document.ops[0]);
        console.log(" Foods is  successfully deleted from database");
      }
    });
  });
});

//add new feature
app.post("/addfeature", (req, res) => {
  const feature = req.body;
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("redOnionRestaurant").collection("feature");
    collection.insert(feature, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops);
        console.log("Feature insert successfully..");
      }
    });
  });
});

//get all feature from database
app.get("/feature", (req, res) => {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("redOnionRestaurant").collection("feature");
    collection.find().toArray((err, document) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(document);
        console.log("Feature is get successfully from database");
      }
    });
  });
});

//Find feature by id (single feature
app.get("/feature/:id", (req, res) => {
  const featureId = Number(req.params.id);
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("redOnionRestaurant").collection("feature");
    collection.find({ id: featureId }).toArray((err, document) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(document);
        console.log("Single feature is get successfully from database");
      }
    });
  });
});

//delete feature from database
app.delete("/delete/:id", (req, res) => {
  const featureId = Number(req.params.id);
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("redOnionRestaurant").collection("feature");
    collection.deleteOne({ id: featureId }, function (error, result) {
      if (error) throw error;
      // send back entire updated list after successful request
      collection.find().toArray(function (_error, _result) {
        if (_error) throw _error;
        res.json(_result);
        console.log("Data is deleted successfully...");
      });
    });
  });
});

//Update feature into the database
app.put("/update/feature/:id", (req, res) => {
  const featureId = Number(req.params.id);
  const featureItem = req.body;
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("redOnionRestaurant").collection("feature");
    collection.updateOne(
      { id: featureId },
      { $set: featureItem },
      (error, result) => {
        if (error) throw error;
        // send back entire updated list, to make sure frontend data is up-to-date
        collection.find().toArray(function (error, result) {
          if (error) throw error;
          res.json(result);
          console.log("Feature updated successfully..");
        });
      }
    );
  });
});

// Post submit order
app.post("/submitorder", (req, res) => {
  const data = req.body;
  console.log(data);
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("redOnionRestaurant").collection("orders");
    collection.insert(data, (rej, result) => {
      if (rej) {
        res.status(500).send("Failed to order request process");
      } else {
        res.send(result.ops[0]);
      }
    });
  });
});

//get all orders
app.get("/orders", (req, res) => {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("redOnionRestaurant").collection("orders");
    collection.find().toArray((err, document) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(document);
        console.log("order is get successfully from database");
      }
    });
  });
});

//Delete IP: 27.147.201.125/32
app.all("*", (req, res) => {
  res.send(
    '<h1 style="color:red;text-align:center;margin-top:20px">Red Onion Restaurant Server Not Found</h1>'
  );
});

const port = process.env.PORT || 4200;
app.listen(port, (err) => console.log("Running on the port", port));
