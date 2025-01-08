module.exports = function (app, myDataBase) {
  // Home route, renders the login page
  app.route("/").get((req, res) => {
    res.render("index", {
      title: "Connected to Database",
      message: "Please log in",
      showRegistration: true,
    });
  });

  

  
  // POST route for login using passport.authenticate
  app.route("/login").post(
    passport.authenticate("local", {
      failureRedirect: "/",
      successRedirect: "/profile",
    }),
  );
  app.route('/logout')
    .get((req, res) => {
      req.logout();
      res.redirect('/');
  });

  
  app.use((req, res, next) => {
    res.status(404)
      .type('text')
      .send('Not Found');
  });
}