var express = require("express");
var router = express.Router();
var Account = require("../models/accounts");
var Item = require("../models/item");
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