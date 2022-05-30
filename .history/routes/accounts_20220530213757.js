var express = require("express");
var router = express.Router();
var Account = require("../models/accounts");
var User = require("../models/user");


// Add details to account route
router.get("/accounts", isValidUser, async function (req, res, next) {
  User.findOne({ _id: req.user._id })
    .then((result) => {
      return res.render("accounts", { "accounts": result });
    })
    .catch((err) => {
      //return res.status(501).json(err);
      res.redirect("/users/dashboard");
    });
});


// Add details to dashboard
router.post("/accounts", isValidUser, async function (req, res, next) {
  addItemToDatabase(req, res);
});

async function addItemToDatabase(req, res) {
  var account = new Account({
    cost: req.body.cost,
    income: req.body.income,
    profit: req.body.profit,
    date: req.body.date,
    userid: req.body.userid,
  });
  try {
    account1 = await account.save();
    User.findOne({ _id: req.body.userid }, function (err, user) {
      if (err) {
        return res.redirect("/users/dashboard");
      }
      if (!user) {
        return res.redirect("/users/dashboard");
      }
      return res.render("accounts", {
        error: "details added succssfully!",
        user: user,
      });
    });
    //return res.status(201).json(doc);
  } catch (error) {
    User.findOne({ _id: req.body.id }, function (err, user) {
      if (err) {
        return res.redirect("/users/dashboard");
      }
      if (!user) {
        return res.redirect("/users/dashboard");
      }
      return res.render("additem", { error: error, user: user });
    });
  }
}