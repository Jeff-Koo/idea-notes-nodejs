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

// load mongoose
import mongoose from "mongoose";
// create mongo connection, '/note-dev' is the databse name
// it is a Promise Object so set the response and catch (cuz db out of program control, can't tell when data come back)
// database connection is done
mongoose
  .connect("mongodb://localhost:27017/note-dev")
  .then(  () => console.log("Mongodb connected.........") )
  .catch( (err) => console.log(err) );


// import ideasRoute 
import ideasRoute from "./routes/ideasRoute.js";


const app = express();

// setup handlebars middleware
app.engine("handlebars", engine());     // must first
app.set("view engine", "handlebars");   // second
app.set("views", "./views");            // second
app.use(morgan("tiny"));

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
  })
);

// connect-flash store flash messages in session, 
// therefore the setup of express-session is needed   
app.use(flash());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
})


app.get("/", (req, res) => {
  res.render("index",           // send --> render (ES6) : change package.json "type": "module"
        {title: "Welcome"}); 
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.use("/ideas", ideasRoute);



// when the route is not handled by the routes above, then finally handle by route "404"
// handle 404 - Not Found
app.use("*", (req, res) => {        // match every path, always be the last route
  res.status(404);                        // set status to 404
  res.render("404");                      // give 404.handlebars 
});


const PORT = 3100;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
