"use strict";
require("dotenv").config();
const express = require("express");
const myDB = require("./connection");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const session = require("express-session");
const passport = require("passport");
const { ObjectID } = require("mongodb");
const LocalStrategy = require("passport-local");
const app = express();
const bcrypt = require('bcrypt');
const routes = require('./routes.js');
const auth = require('./auth.js');




async function startServer() {
  fccTesting(app); // FCC testimise jaoks
  app.use("/public", express.static(process.cwd() + "/public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Set Pug as the view engine and specify the views directory
  app.set("view engine", "pug");
  app.set("views", "./views/pug");

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  try {
    await myDB(async (client) => {
      const myDataBase = await client.db("database").collection("users");
      console.log("Connected to the database");
      routes(app, myDataBase);
      auth(app, myDataBase);

      
    });
  } catch (e) {
    console.error("Database connection failed:", e.message);
    app.route("/").get((req, res) => {
      res.render("index", {
        title: "Error",
        message: "Unable to connect to the database",
      });
    });
  }

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
  });
}

// Call startServer to start the app
startServer();
