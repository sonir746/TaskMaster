// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Simple in-memory storage instead of MongoDB for testing
let items = ["Welcome to your Todolist!", "Hit the + button to add a new item.", "<-- Hit this to delete an item.>"];
let customLists = {};

app.get("/", function (req, res) {
  const day = "Today";  // Simplified for testing
  res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {
  const item = req.body.newItem.trim();
  const listName = req.body.list;

  if (listName === "Today") {
    if (item.length !== 0) {
      items.push(item);
    }
    res.redirect("/");
  } else {
    if (!customLists[listName]) {
      customLists[listName] = [];
    }
    if (item.length !== 0) {
      customLists[listName].push(item);
    }
    res.redirect("/" + listName);
  }
});

app.post("/delete", function (req, res) {
  const checkboxId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    items.splice(checkboxId, 1);
    res.redirect("/");
  } else {
    customLists[listName].splice(checkboxId, 1);
    res.redirect("/" + listName);
  }
});

app.get("/:customListName", function (req, res) {
  const customListName = _.startCase(req.params.customListName);

  if (!customLists[customListName]) {
    customLists[customListName] = ["Default item 1", "Default item 2"];
  }

  res.render("list", { listTitle: customListName, newListItems: customLists[customListName] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
