var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Board = require("../models/board");

const passport = require("passport");

// Dashboard Route
router.get("/dashboard", isValidUser, async function (req, res, next) {
  User.findOne({ _id: req.user._id })
    .then((result) => {
      return res.render("dashboard", { "user": result });
    })
    .catch((err) => {
      alert(err);
      res.redirect("/login");
    });
});

// addvision

// router.get("/dashboards", isValidUser, async function (req, res, next) {
//   User.findOne({ _id: req.user._id })
//     .then((result) => {
//       return res.render("dashboard", { user: result });
//     })
//     .catch((err) => {
//       //return res.status(501).json(err);
//       console.log("object");
//       res.redirect("/users/dashboard");
//     });
// });

// // Add vision to Database
router.post("/dashboards", isValidUser, async function (req, res, next) {
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
      return res.render("/users/dashboard", { "error": error, "user": user });
    });
  }
}

// view vision
router.get("/dashboard", isValidUser, async function (req, res, next) {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      Board.find({ userid: user._id })
        .then((board) => {
          return res.render("dashboards", { "board": board," user": user });
        })
        .catch((err) => {
          //return res.status(501).json(err);
          res.redirect("/users/dashboard.");
        });
    })
    .catch((err) => {
      //return res.status(501).json(err);
      res.redirect("/users/dashboard");
      console.log("object");
    });
});

// // edit vision board

// router.get("/dashboard/:id", isValidUser, async function (req, res, next) {
//   id = req.params.id;
//   User.findOne({ _id: req.user._id })
//     .then((user) => {
//       Board.findOne({ _id: id })
//         .then((board) => {
//           return res.render("dashboard", { board: board, user: user });
//         })
//         .catch((err) => {
//           //return res.status(501).json(err);
//           res.redirect("/users/dashboard");
//         });
//     })
//     .catch((err) => {
//       //return res.status(501).json(err);
//       res.redirect("/users/dashboard");
//     });
// });

// // update vision board

// router.post("/dashboard/:id", isValidUser, async function (req, res, next) {
//   income = req.body.income;
//   expenses = req.body.expenses;
//   budget = req.body.budget;
//   profit = req.body.profit;
//   vision = req.body.vision;
//   Board.update(
//     { _id: id },
//     {
//       $set: {
//         income: req.body.income,
//         expenses: req.body.expenses,
//         budget: req.body.budget,
//         profit: req.body.profit,
//         vision: req.body.vision,
//       },
//     }
//   )
//     .then((board) => {
//       return res.redirect("/dashboard");
//     })
//     .catch((err) => {
//       //return res.status(501).json(err);
//       res.redirect("/users/dashboard");
//     });
// });

// Settings Route
router.get("/settings", isValidUser, function (req, res, next) {
  User.findOne({ _id: req.user._id })
    .then((result) => {
      return res.render("settings", { user: result });
    })
    .catch((err) => {
      //return res.status(501).json(err);
      res.redirect("/login");
    });
  //return res.status(200).json(req.user);
});

// Posting to Settings (Changing Name/Email)
router.post("/settings/public", isValidUser, function (req, res, next) {
  User.update(
    { _id: req.user._id },
    { $set: { name: req.body.name, email: req.body.email } }
  )
    .exec()
    .then((result) => {
      //return res.status(201).json(result);
      res.redirect("/users/dashboard");
    })
    .catch((err) => {
      //return res.status(501).json(err);
      res.redirect("/users/settings");
    });
});

// Posting to Settings (Changing Password)
router.post("/settings/password", isValidUser, function (req, res, next) {
  User.findOne({ _id: req.user._id }, function (err, user) {
    //return res.status(201).json(result);
    if (err) {
      res.redirect("/login");
    }
    if (!user.isValid(req.body.password)) {
      return res.render("settings", {
        error: "Incorrect password",
        user: user,
      });
    }
    if (req.body.pass1 !== req.body.pass2) {
      return res.render("settings", {
        error: "Passwords dont match",
        user: user,
      });
    }
    User.update(
      { _id: user._id },
      { $set: { password: User.hashPassword(req.body.password) } }
    )
      .exec()
      .then((result) => {
        //return res.status(201).json(result);
        return res.redirect("/users/dashboard");
      })
      .catch((err) => {
        //return res.status(501).json(err);
        return res.render("settings", { error: err, user: user });
      });
  });
});

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
