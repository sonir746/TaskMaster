// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Use environment variable for MongoDB URI
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/todolistDB";

// Connect to MongoDB without deprecated options
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

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

const defaultItem = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: { type: String, unique: true },  // Add unique constraint
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

const day = date.getDate();  // This should work if `getDate` is correctly exported from `date.js`

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.get("/", (req, res) => {
  Item.find()
    .then(result => {
      if (result.length === 0) {
        Item.insertMany(defaultItem)
          .then(() => res.redirect("/"))
          .catch(err => console.log(err));
      } else {
        res.render("list", { listTitle: day, newListItems: result });
      }
    })
    .catch(err => console.log(err));
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem.trim();
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === day) {
    if (itemName.length !== 0) {
      item.save()
        .then(() => res.redirect("/"))
        .catch(err => console.log(err));
    }
  } else {
    List.findOne({ name: listName })
      .then(result => {
        if (itemName.length !== 0) {
          result.items.push(item);
          result.save()
            .then(() => res.redirect("/" + listName))
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }
});

app.post("/delete", (req, res) => {
  const checkboxId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === day) {
    Item.findByIdAndDelete(checkboxId)
      .then(() => res.redirect("/"))
      .catch(err => console.log(err));
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkboxId } } }
    )
      .then(() => res.redirect("/" + listName))
      .catch(err => console.log(err));
  }
});

app.get("/:customListName", (req, res) => {
  const customListName = _.startCase(req.params.customListName);

  List.findOne({ name: customListName })
    .then(result => {
      if (!result) {
        const list = new List({
          name: customListName,
          items: defaultItem
        });

        list.save()
          .then(() => res.redirect("/" + customListName))
          .catch(err => console.log("Error saving new list:", err));
      } else {
        res.render("list", { listTitle: customListName, newListItems: result.items });
      }
    })
    .catch(err => console.log("Error finding list:", err));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
