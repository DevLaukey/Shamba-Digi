var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Board = require("../models/board");


// Add vision to Database
// router.post("/vision", isValidUser, async function (req, res, next) {
//   addItemToDatabase(req, res);
// });

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
    //return res.status(201).json(doc);
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

// view vision
router.get("/vision", isValidUser, async function (req, res, next) {
  User.findOne({ _id: req.user._id })
    .then(user => {
      Board.find({ userid: user._id })
        .then(board => {
          return res.render("dashboard", { "board": board, "user": user });
        })
        .catch((err) => {
          //return res.status(501).json(err);
          res.redirect("/users/dashboard");
        });
    })
    .catch((err) => {
      //return res.status(501).json(err);
      res.redirect("/users/dashboard");
      console.log("object");
    });
});

// // // edit vision board

// // router.get("/dashboard/:id", isValidUser, async function (req, res, next) {
// //   id = req.params.id;
// //   User.findOne({ _id: req.user._id })
// //     .then((user) => {
// //       Board.findOne({ _id: id })
// //         .then((board) => {
// //           return res.render("dashboard", { board: board, user: user });
// //         })
// //         .catch((err) => {
// //           //return res.status(501).json(err);
// //           res.redirect("/users/dashboard");
// //         });
// //     })
// //     .catch((err) => {
// //       //return res.status(501).json(err);
// //       res.redirect("/users/dashboard");
// //     });
// // });

// // // update vision board

// // router.post("/dashboard/:id", isValidUser, async function (req, res, next) {
// //   income = req.body.income;
// //   expenses = req.body.expenses;
// //   budget = req.body.budget;
// //   profit = req.body.profit;
// //   vision = req.body.vision;
// //   Board.update(
// //     { _id: id },
// //     {
// //       $set: {
// //         income: req.body.income,
// //         expenses: req.body.expenses,
// //         budget: req.body.budget,
// //         profit: req.body.profit,
// //         vision: req.body.vision,
// //       },
// //     }
// //   )
// //     .then((board) => {
// //       return res.redirect("/dashboard");
// //     })
// //     .catch((err) => {
// //       //return res.status(501).json(err);
// //       res.redirect("/users/dashboard");
// //     });
// // });

function isValidUser(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    console.log("Unauthorized request");
    res.redirect("/login");
    //return res.status(401).json({message:'Unauthorized Request'});
  }
}

module.exports = router;
