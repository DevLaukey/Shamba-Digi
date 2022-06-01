var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Board = require("../models/board");



router.post("/vision", isValidUser, async function (req, res, next) {
  addItemToDatabase(req, res);
});

async function addItemToDatabase(req, res) {
  var board = new Board({
    income: req.body.income,
    expenses: req.body.expenses,
    budget: req.body.budget,
    profit: req.body.profit,
    vision: req.body.vision,
    userid: req.body.userid,
  });
  try {
    board1 = await board.save();
    User.findOne({ _id: req.body.userid }, function (err, user) {
      if (err) {
        return res.redirect("/users/dashboard");
      }
      if (!user) {
        return res.redirect("/users/dashboard");
      }
      return res.render("dashboard", {
        error: "vision board added succssfully!",
        user: user,
        board: board
      });
    });
    
  } catch (error) {
    User.findOne({ _id: req.body.id }, function (err, user) {
      if (err) {
        return res.redirect("/users/dashboard");
      }
      if (!user) {
        return res.redirect("/users/dashboard");
      }
      return res.render("dashboard", { "error": error, "user": user });
    });
  }
}


router.post('/delete',isValidUser, async function(req,res,next){
  Board.delete().then(console.log("delete")).catch(err=>{
      
      res.redirect("/users/dashboard")
    })
});








































































function isValidUser(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    console.log("Unauthorized request");
    res.redirect("/login");
    
  }
}

module.exports = router;
