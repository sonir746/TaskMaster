//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const { name } = require("ejs");
const _ = require('lodash');
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/todolistDB");
mongoose.connect("mongodb+srv://sonir746:usemongodb@cluster0.dc3bi.mongodb.net/todolistDB");

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your Todolist!"
})
const item2 = new Item({
  name: "Hit the + button to add a new item."
})
const item3 = new Item({
  name: "<-- Hit this to delete an item.>"
});





const defaultItem = [item1, item2, item3]

const listSchema = new mongoose.Schema({
  name: { type: String, unique: true },  // Add unique constraint
  items: [itemsSchema]
});


const List = mongoose.model("List", listSchema)

const day = date.getDate();

app.get("/", function (req, res)
{
  Item.find()
    .then(result =>
    {

      if (result.length === 0) {
        Item.insertMany(defaultItem)
          .then(result =>
          {

            res.redirect("/")
          })
          .catch(err =>
          {
            console.log(err)
          })


      } else {
        res.render("list", { listTitle: day, newListItems: result });
      }

    })
    .catch(err =>
    {
      console.log(err)
    })



});


app.post("/", function (req, res)
{
  const itemName = req.body.newItem.trim();
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  })

  if (listName === day) {
    if (itemName.length !== 0) {
      item.save()
        .then(() =>
        {
          res.redirect("/")
        })
        .catch(err =>
        {
          console.log(err)
        });
    }

  } else {
    List.findOne({ name: listName })
      .then(result =>
      {
        if (itemName.length !== 0) {
          result.items.push(item);
          result.save()
            .then(() =>
            {
              res.redirect("/" + listName)
            })
            .catch(err =>
            {
              console.log(err)
            });
        }

      })
      .catch(err =>
      {
        console.log(err)
      })
  }


});


app.post("/delete", (req, res) =>
{

  const checkboxId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === day) {
    // Remove from the Item collection
    Item.findByIdAndDelete(checkboxId)
      .then(() =>
      {
        res.redirect("/");
      })
      .catch(err =>
      {
        console.log(err);
      });
  } else {
    // Remove from the List collection
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkboxId } } }
    )
      .then(() =>
      {
        res.redirect("/" + listName);
      })
      .catch(err =>
      {
        console.log(err);
      });
  }
});




app.get("/:customListName", function (req, res)
{
  let customListName = _.startCase(req.params.customListName);

  List.findOne({ name: customListName })
    .then(result =>
    {
      if (!result) {
        const list = new List({
          name: customListName,
          items: defaultItem
        });

        list.save()
          .then(() =>
          {
            res.redirect("/" + customListName);
          })
          .catch(err =>
          {
            console.log("Error saving new list:", err);
          });
      } else {
        res.render("list", { listTitle: customListName, newListItems: result.items });
      }
    })
    .catch(err =>
    {
      console.log("Error finding list:", err);
    });
});






app.get("/about", function (req, res)
{
  res.render("about");
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, function ()
{
  console.log(`Server started on port ${PORT}`);
});
