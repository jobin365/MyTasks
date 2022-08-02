require("dotenv").config();
const express = require("express");
const app = express();
// const port = 3000;
const port = 3001;
const mongoose = require("mongoose");
const path = require("path");

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

mongoose.connect("mongodb://localhost:27017/gidDB");
// mongoose.connect("mongodb+srv://jobin-admin:<password>@cluster0.1ktsf.mongodb.net/gidDB?retryWrites=true&w=majority");
app.use(express.json());

app.use(express.static(path.join(__dirname, "build")));

const List = mongoose.model("List", { name: String, items: [] });

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["http://localhost:3000"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  res.append("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  lists: [{ name: String, items: [] }],
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      // callbackURL: "https://sleepy-ridge-02151.herokuapp.com/auth/google/secrets",
      callbackURL:"http://localhost:3001/auth/google/secrets"
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id,username:profile.emails[0].value }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile","email"] })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("http://localhost:3000");
    // res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      res.send({logout:"success"});
    }
  });
});

app.get("/getFirstList", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.lists.length === 0) {
            res.send({ id: undefined });
          } else {
            res.send({ id: foundUser.lists[0]._id });
          }
        }
      }
    });
  } else {
    res.send({ message: "Unauthenticated request" });
  }
});

app.get("/getListList", (req, res) => {
  if (req.isAuthenticated()) {
    const list = [];
    User.findById(req.user.id, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.lists.length === 0) {
            res.send({ lists: [] });
          } else {
            res.send({ lists: foundUser.lists });
          }
        }
      }
    });
  } else {
    res.send({ message: "Unauthenticated request" });
  }
});

app.get("/getList/:listID", (req, res) => {
  if (req.isAuthenticated()) {
    const listID = req.params.listID;
    User.findById(req.user.id, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          foundUser.lists.forEach((list) => {
            if (list._id == listID) {
              res.send(list);
            }
          });
        }
      }
    });
  } else {
    res.send({ message: "Unauthenticated request" });
  }
});

app.get("/checkLoginStatus", (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ status: true,username:req.user.username });
  } else {
    res.send({ status: false });
  }
});

app.patch("/addItem/:listID", (req, res) => {
  if (req.isAuthenticated()) {
    const listID = req.params.listID;
    const newItem = req.body.item;
    User.findById(req.user.id, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          var i=0;
          foundUser.lists.forEach((list) => {
            if (list._id == listID) {
              foundUser.lists[i].items.push(newItem);
              foundUser.save().then(()=>{
                res.send({addItem:"success"});
              });
            }
            i=i+1;
          });
        }
      }
    });
  } else {
    res.send({ message: "Unauthenticated request" });
  }
});

app.patch("/deleteItem/:listID", (req, res) => {
  
  if (req.isAuthenticated()) {
    const listID = req.params.listID;
    const index = req.body.index;
    User.findById(req.user.id, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          var i=0;
          foundUser.lists.forEach((list) => {
            if (list._id == listID) {
              foundUser.lists[i].items.splice(index,1);
              foundUser.save().then(()=>{
                res.send({deleteItem:"success"});
              });
            }
            i++;
          });
        }
      }
    });
  } else {
    res.send({ message: "Unauthenticated request" });
  }
});

app.post("/createList", (req, res) => {
  if (req.isAuthenticated()) {
    const listName = req.body.listName;
    const newList = new List({ name: listName, items: [] });
    User.findById(req.user.id, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          foundUser.lists.push(newList);
          foundUser.save().then(() => {
            res.send({ id: newList._id });
          });
        }
      }
    });
  } else {
    res.send({ message: "Unauthenticated request" });
  }
});

app.delete("/deleteList/:listID", (req, res) => {
  if (req.isAuthenticated()) {
    const listID = req.params.listID;
    User.findById(req.user.id, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          var i=0;
          foundUser.lists.forEach((list) => {
            if (list._id == listID) {
              foundUser.lists.splice(i,1);
              foundUser.save().then(()=>{
                res.send({deleteList:"success"});
              });
            }
            i++;
          });
        }
      }
    });
  } else {
    res.send({ message: "Unauthenticated request" });
  }
});

app.patch("/updateListName/:listID", (req, res) => {
  if (req.isAuthenticated()) {
    const listID = req.params.listID;
    const newListName = req.body.newListName;
    User.findById(req.user.id, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          var i=0;
          foundUser.lists.forEach((list) => {
            if (list._id == listID) {
              foundUser.lists[i].name=newListName;
              foundUser.save().then(()=>{
                res.send({updateListName:"success"});
              });
            }
            i++;
          });
        }
      }
    });
  } else {
    res.send({ message: "Unauthenticated request" });
  }
});

app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.send({ register: "failed", error: err.message });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.send({ register: "success" });
        });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
      console.log("failed login");
      res.send({ login: "failed" , error: err.message });
    } else {
      passport.authenticate("local")(req, res, () => {
        res.send({ login: "success" });
      });
    }
  });
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`);
});
