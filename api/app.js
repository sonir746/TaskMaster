// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');
const loc = __dirname + "/../date.js";
const date = require(loc);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Check if the mongoose connection is already established
let isConnected;

async function connectToDatabase() {
  if (!isConnected) {
    try {
      const db = await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://sonir746:usemongodb@cluster0.dc3bi.mongodb.net/todolistDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
      isConnected = db.connections[0].readyState;
      console.log("Connected to MongoDB");
    } catch (err) {
      console.log("Error connecting to MongoDB:", err);
    }
  }
}

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your Todolist!"
});
const item2 = new Item({
  name: "Hit the + button to add a new item."
});
const item3 = new Item({
  name: "<-- Hit this to delete an item.>"
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: { type: String, unique: true },  // Add unique constraint
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

const day = date.getDate();

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.get("/", async function (req, res) {
  await connectToDatabase(); // Ensure DB connection before proceeding
  try {
    const items = await Item.find();
    if (items.length === 0) {
      await Item.insertMany(defaultItems);
      return res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItems: items });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.post("/", async function (req, res) {
  await connectToDatabase(); // Ensure DB connection before proceeding
  const itemName = req.body.newItem.trim();
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  try {
    if (listName === day) {
      if (itemName.length !== 0) {
        await item.save();
        res.redirect("/");
      }
    } else {
      const foundList = await List.findOne({ name: listName });
      if (foundList && itemName.length !== 0) {
        foundList.items.push(item);
        await foundList.save();
        res.redirect("/" + listName);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.post("/delete", async (req, res) => {
  await connectToDatabase(); // Ensure DB connection before proceeding
  const checkboxId = req.body.checkbox;
  const listName = req.body.listName;

  try {
    if (listName === day) {
      await Item.findByIdAndDelete(checkboxId);
      res.redirect("/");
    } else {
      await List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: checkboxId } } }
      );
      res.redirect("/" + listName);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.get("/:customListName", async function (req, res) {
  await connectToDatabase(); // Ensure DB connection before proceeding
  let customListName = _.startCase(req.params.customListName);

  try {
    const foundList = await List.findOne({ name: customListName });
    if (!foundList) {
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      await list.save();
      res.redirect("/" + customListName);
    } else {
      res.render("list", { listTitle: customListName, newListItems: foundList.items });
    }
  } catch (err) {
    console.log("Error finding list:", err);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
