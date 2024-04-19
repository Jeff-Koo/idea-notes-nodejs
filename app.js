import express from "express";              // require --> import (ES6) : change package.json "type" : "module"
import { engine } from "express-handlebars";
import morgan from "morgan";

const app = express();


// setup handlebars middleware
app.engine("handlebars", engine());     // must first
app.set("view engine", "handlebars");   // second
app.set("views", "./views");            // second
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.render("index",           // send --> render (ES6) : change package.json "type": "module"
        {title: "Welcome"}); 
});


const PORT = 3100;

app.listen(PORT, () => {
  // ` is the backtick sign, located on the left-top of keyboard, next to the '1' key
  console.log(`Server started on port ${PORT}`);  
} );