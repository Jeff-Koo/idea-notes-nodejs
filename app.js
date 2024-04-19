import express from "express";              // require --> import (ES6) : change package.json "type" : "module"
import { engine } from "express-handlebars";
import morgan from "morgan";

/** 8. */
// load body-parsoer
import bodyParser from "body-parser";

// load mongoose
import mongoose from "mongoose";
// create mongo connection, '/note-dev' is the databse name
// it is a Promise Object so set the response and catch (cuz db out of program control, can't tell when data come back)
// database connection is done
mongoose
  .connect("mongodb://localhost:27017/note-dev")
  .then(  () => console.log("Mongodb connected.........") )
  .catch( (err) => console.log(err) );
/** end of 8. */

/** 11. */
import Idea from "./models/Ideas.js"
/** end of 11. */

const app = express();


// setup handlebars middleware
app.engine("handlebars", engine());     // must first
app.set("view engine", "handlebars");   // second
app.set("views", "./views");            // second
app.use(morgan("tiny"));

/** 8. */
// put body-parser middleware here
app.use(bodyParser.urlencoded({ extended: false }));    // support URL-encoded bodies
app.use(bodyParser.json());        // parse application/json (support JSON-encoded bodies)
/** end of 8. */


app.get("/", (req, res) => {
  res.render("index",           // send --> render (ES6) : change package.json "type": "module"
        {title: "Welcome"}); 
});

/** 7. */
app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/ideas", (req, res) => {
  res.render("ideas/ideasIndex");   // follow file structure, start from 'views' folder
});

app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");          // follow file structure, start from 'views' folder
});
/** end of 7. */


/** 12. */
app.post("/ideas/add", (req, res) => {
  let errors = [];  // an Array to store the error messages
  
  // push error message into errors[] if empty input
  if (!req.body.title){
    errors.push({ text: "please add a title" });
  }
  if (!req.body.details){
    errors.push({ text: "please add some details" });
  }

  // if there is errors, render the page 
  // with error messages in errors[] and the inputted title & details
  if (errors.length > 0) {
    res.render(
      "ideas/add", {
        errors: errors,
        title: req.body.title,
        details: req.body.details,
      }
    );
  } else {
    // if data are good then come to here
    // use the newUser to keep the data object,
    // in the future the object can scalable for other info
    const newUser = {
      title : req.body.title,
      details : req.body.details,
    };
    new Idea(newUser).save().then( () => {      // this is a Promise Object
      res.redirect("/");
    });
  }
});
/** end of 12. */


/** 7. */
// when the route is not handled by the routes above, then finally handle by route "404"
// handle 404 - Not Found
app.use("*", (req, res) => {        // match every path, always be the last route
  res.status(404);                        // set status to 404
  res.render("404");                      // give 404.handlebars 
});
/** end of 7. */

const PORT = 3100;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
} );