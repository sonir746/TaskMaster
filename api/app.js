// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://sonir746:usemongodb@cluster0.dc3bi.mongodb.net/todolistDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define schemas and models
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
  name: { type: String, unique: true },
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

// Get current date
const day = date.getDate();

// Routes
app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.get("/", function (req, res) {
  console.log("GET / request received");
  
  Item.find()
    .then(result => {
      console.log("Database query completed");
      
      if (result.length === 0) {
        Item.insertMany(defaultItem)
          .then(() => {
            console.log("Default items inserted");
            res.redirect("/");
          })
          .catch(err => {
            console.error("Error inserting default items:", err);
            res.status(500).send("Internal Server Error");
          });
      } else {
        res.render("list", { listTitle: day, newListItems: result });
      }
    })
    .catch(err => {
      console.error("Database query error:", err);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem.trim();
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === day) {
    if (itemName.length !== 0) {
      item.save()
        .then(() => {
          console.log("Item saved");
          res.redirect("/");
        })
        .catch(err => {
          console.error("Error saving item:", err);
          res.status(500).send("Internal Server Error");
        });
    }
  } else {
    List.findOne({ name: listName })
      .then(result => {
        if (itemName.length !== 0) {
          result.items.push(item);
          result.save()
            .then(() => {
              console.log("Item added to list");
              res.redirect("/" + listName);
            })
            .catch(err => {
              console.error("Error saving item to list:", err);
              res.status(500).send("Internal Server Error");
            });
        }
      })
      .catch(err => {
        console.error("Error finding list:", err);
        res.status(500).send("Internal Server Error");
      });
  }
});

app.post("/delete", (req, res) => {
  const checkboxId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === day) {
    Item.findByIdAndDelete(checkboxId)
      .then(() => {
        console.log("Item deleted");
        res.redirect("/");
      })
      .catch(err => {
        console.error("Error deleting item:", err);
        res.status(500).send("Internal Server Error");
      });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkboxId } } }
    )
      .then(() => {
        console.log("Item removed from list");
        res.redirect("/" + listName);
      })
      .catch(err => {
        console.error("Error removing item from list:", err);
        res.status(500).send("Internal Server Error");
      });
  }
});

app.get("/:customListName", function (req, res) {
  let customListName = _.startCase(req.params.customListName);

  List.findOne({ name: customListName })
    .then(result => {
      if (!result) {
        const list = new List({
          name: customListName,
          items: defaultItem
        });

        list.save()
          .then(() => {
            console.log("New list created");
            res.redirect("/" + customListName);
          })
          .catch(err => {
            console.error("Error saving new list:", err);
            res.status(500).send("Internal Server Error");
          });
      } else {
        res.render("list", { listTitle: customListName, newListItems: result.items });
      }
    })
    .catch(err => {
      console.error("Error finding list:", err);
      res.status(500).send("Internal Server Error");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
