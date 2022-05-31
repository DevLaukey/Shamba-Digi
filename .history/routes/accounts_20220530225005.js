var express = require("express");
var router = express.Router();
var Account = require("../models/accounts");
var User = require("../models/user");


// Add details to account route
router.get("/addinfo", isValidUser, async function (req, res, next) {
  User.findOne({ _id: req.user._id })
    .then((result) => {
      return res.render("addinfo", { "user": result });
    })
    .catch((err) => {
      //return res.status(501).json(err);
      res.redirect("/users/dashboard");
    });
});


// Add details to dashboard
router.post("/addinfo", isValidUser, async function (req, res, next) {
  addItemToDatabase(req, res);
});

async function addItemToDatabase(req, res) {
  const cost = req.body.cost;
  const income = req.body.income;
  const profit = income - cost;

  var account = new Account({
    cost: req.body.cost,
    income: req.body.income,
    profit: profit,
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
      return res.render("addinfo", {
        "error": "details added succssfully!",
        "user": user,
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
      return res.render("addinfo", { "error": error, "user": user });
    });
  }
}

// view accounts
router.get("/allinfo", isValidUser, async function (req, res, next) {
  User.findOne({ _id: req.user._id })
    .then((user) => {
    Account.find({ userid: user._id })
        .then((items) => {
          return res.render("allinfo", { "accounts": items, "user": user });
        })
        .catch((err) => {
          //return res.status(501).json(err);
          res.redirect("/users/dashboard");
        });
    })
    .catch((err) => {
      //return res.status(501).json(err);
      res.redirect("/users/dashboard");
    });
});


// edit
router.get("/editinfo/:id", isValidUser, async function (req, res, next) {
  id = req.params.id;
  User.findOne({ _id: req.user._id })
    .then((user) => {
      Account.findOne({ _id: id })
        .then((item) => {
          return res.render("editinfo", { "account": item, "user": user });
        })
        .catch((err) => {
          //return res.status(501).json(err);
          res.redirect("/users/dashboard");
        });
    })
    .catch((err) => {
      //return res.status(501).json(err);
      res.redirect("/users/dashboard");
    });
});

// Update an Item 
router.post('/editinfo/:id',isValidUser, async function(req,res,next){
  id=req.params.id;
  cost=req.body.cost;
  income = req.body.income;
  profit = req.body.profit;
  date=req.body.date;
  Account.update({_id:id},{$set:{cost:cost,income:income,profit:profit,date:date}}).then(item=>{
    return res.redirect('/accounts/editinfo/'+id)
    }).catch(err=>{
      //return res.status(501).json(err);
      res.redirect("/users/dashboard")
    })
});

//Delete an Item
router.post('/deleteaccount/:id',isValidUser, async function(req,res,next){
  id=req.params.id;
  Account.deleteOne({_id:id}).then(item=>{
    return res.redirect('/accounts')
    }).catch(err=>{
      //return res.status(501).json(err);
      res.redirect("/users/dashboard")
    })
});


function isValidUser(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    alert("Unauthorized request");
    console.log("Unauthorized request");
    res.redirect("/login");
    //return res.status(401).json({message:'Unauthorized Request'});
  }
}

module.exports = router;
