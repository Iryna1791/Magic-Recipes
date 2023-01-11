
const isLoggedIn = (req, res, next) => {
    // checks if the user is logged in when trying to access a specific page
    if (!req.session.currentUser) {
      return res.redirect("/auth/login");
    }
    next();
  };


  const isLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
        next(); // execute the next action for this route
    }
    else{
        return res.redirect('/');
    }

  };

  module.exports = {isLoggedIn, isLoggedOut};


// ℹ️ Needed when we deal with cookies (we will when dealing with authentication)
// https://www.npmjs.com/package/cookie-parser
const cookieParser = require("cookie-parser");

// :fuente_de_información: Session middleware for authentication
// https://www.npmjs.com/package/express-session
const session = require("express-session");

// :fuente_de_información: MongoStore in order to save the user session in the database
// https://www.npmjs.com/package/connect-mongo
const MongoStore = require("connect-mongo");

// Connects the mongo uri to maintain the same naming structure
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/project2"; //VERIFICAR AQUI

// ℹ️ Serves a custom favicon on each request
// https://www.npmjs.com/package/serve-favicon
const favicon = require("serve-favicon");

// ℹ️ global package used to `normalize` paths amongst different operating systems
// https://www.npmjs.com/package/path
const path = require("path");

// Middleware configuration
module.exports = (app) => {
  // In development environment the app logs
  app.use(logger("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Normalizes the path to the views folder
  app.set("views", path.join(__dirname, "..", "views"));
  // Sets the view engine to handlebars
  app.set("view engine", "hbs");
  // Handles access to the public folder
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Handles access to the favicon
  app.use(favicon(path.join(__dirname, "..", "public", "images", "favicon.ico")));
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "super hyper secret key",
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: MONGO_URI,
      }),
    })
  );
};

  


  const isOwner = (req, res, next) => {
    const recipeId = req.params
    const userId = req.session.currentUser._id

    Recipe.findById(recipeId)
      .then((foundRecipe) => {
        const recipeOwner = foundRecipe.owner
        if (recipeOwner === userId){
          next()
        }
      })
  }

  const isNotOwner = (req, res, next) => {
    if(req.session.currentUser && req.session.currentUser._id != req.params) {
      next ()
      
    }
    else {
      return res.redirect('/recipes/list');
      }
  }
   
  module.exports = {
    isLoggedIn,
    isOwner,
    isNotOwner
  };

