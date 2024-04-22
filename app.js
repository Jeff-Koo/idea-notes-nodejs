import express from "express";              // require --> import (ES6) : change package.json "type" : "module"
import { engine } from "express-handlebars";
import morgan from "morgan";

// import flash & express-session
import flash from "connect-flash";
import session from "express-session";

// load body-parsoer
import bodyParser from "body-parser";

// load method-override
import methodOverride from "method-override";

import dotenv from "dotenv";
dotenv.config();
// console.log(process.env.PORT);     // get the PORT value from '.env' file
// console.log(process.env.mongoURI); // get the mongoURI value from '.env' file


// load mongoose
import mongoose from "mongoose";
// create mongo connection, '/note-dev' is the databse name
// it is a Promise Object so set the response and catch (cuz db out of program control, can't tell when data come back)
// database connection is done
mongoose
  .connect(process.env.mongoURI)
  .then(  () => console.log("Mongodb connected.........") )
  .catch( (err) => console.log(err) );


// import ideasRoute 
import ideasRoute from "./routes/ideasRoute.js";
// import usersRoute 
import usersRoute from "./routes/usersRoute.js";

// load passport 
import passport from "passport";
import passportConfig from "./config/passportConfig.js";
passportConfig(passport);



const app = express();

// setup handlebars middleware
app.engine("handlebars", engine());     // must first
app.set("view engine", "handlebars");   // second
app.set("views", "./views");            // second
app.use(morgan("tiny"));

// make the image folder to be static, then the image can load to HTML
app.use(express.static("views/public"));

// put body-parser middleware here
app.use(bodyParser.urlencoded({ extended: false }));    // support URL-encoded bodies
app.use(bodyParser.json());        // parse application/json (support JSON-encoded bodies)

// put methodOverride middleware with "_method" 
app.use(methodOverride("_method"));


// set up an express-session
app.use(
  session({
      secret: "anything",
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 20 * 60 * 1000      // 20 minutes
      }
  })
);

// connect-flash store flash messages in session, 
// therefore the setup of express-session is needed   
app.use(flash());


// passport middlware must go after express-session initial
// there is serialize session within the passport
app.use(passport.initialize());
app.use(passport.session());    // set up for login session


app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");

  res.locals.fail_passport = req.flash("fail_passport");
  // res.locals.fail_passport    refers to {{fail_passport}} in '_error.handlebars'
  // req.flash("fail_passport")  refers to {type:"fail_passport"} in 'passportConfig.js'

  // create global variable "res.locals.user" to passing through all the modules
  // "req.user" will be set by deserializeUser() in 'passportConfig.js' after user login successfully
  // if there is "req.user" exists, then assign to "res.locals.user", else set null as no user
  res.locals.user = req.user || null;

  // add a line to check whether the login session works properly
  // console.log("===== LOGIN USER =====", res.locals.user); 
  
  next();
})



app.get("/", (req, res) => {
  res.render("index",           // send --> render (ES6) : change package.json "type": "module"
        {title: "Welcome"}); 
});

app.get("/about", (req, res) => {
  res.render("about");
});



import ensureAuthenticated from "./helpers/auth.js";
app.use("/ideas", ensureAuthenticated, ideasRoute);
app.use("/users", usersRoute);



// when the route is not handled by the routes above, then finally handle by route "404"
// handle 404 - Not Found
app.use("*", (req, res) => {        // match every path, always be the last route
  res.status(404);                        // set status to 404
  res.render("404");                      // give 404.handlebars 
});


// in case there is no PORT variable in .env, 
// then user 3200 as the port number
const PORT = process.env.PORT || 3200;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
