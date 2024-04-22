import Idea from "../models/Ideas.js";

export const getAddIdea = (req, res) => {
  res.render("ideas/add"); // follow file structure, start from 'views' folder
};


export const postAddIdea = (req, res) => {
  let errors = []; // an Array to store the error messages

  // push error message into errors[] if empty input
  if (!req.body.title) {
    errors.push({ text: "please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "please add some details" });
  }

  // if there is errors, render the page
  // with error messages in errors[] and the inputted title & details
  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    // if data are good then come to here
    // use the newUser to keep the data object,
    // in the future the object can scalable for other info
    const newUser = {
      title: req.body.title,
      details: req.body.details,
    };
    new Idea(newUser).save().then(() => {
      /** 8. */
      req.flash("success_msg", "Note Added!");
      /** end of 8. */
      res.redirect("/ideas"); // redirect refers to the route defined : app.get('xxx')
    });
  }
};

export const getIdeas = (req, res) => {
  Idea.find() // getting the result in 'ideas' collection by using find()
    .lean()
    .sort({ date: "desc" })
    .then((ideasDB) => {
      // ideas: array of document objects from DB
      console.log(ideasDB);
      res.render("ideas/ideasIndex", {
        ideas: ideasDB, // ideas --> ideasIndex.handlebars(ideas) : ideasDB --> array of objects from DB
      });
    });
};

export const deleteIdea = (req, res) => {
  // :id is a parameter refers to the ObjectID in URL
  console.log(req.params);
  Idea.deleteOne({ _id: req.params.id }).then(() => {
    /** 8. */
    req.flash("error_msg", "Note Deleted!")
    /** end of 8. */
    res.redirect("/ideas");
  });
};

export const getEditIdea = (req, res) => {
  Idea.findOne({
    // use findOne to return only 1 object with ID
    _id: req.params.id,
  })
    .lean()
    .then((ideaDB) => {
      res.render("ideas/edit", {
        idea: ideaDB, // idea (refer to edit.handlebars) : ideaDB (document from DB)
      });
    });
};

export const putEditIdea = (req, res) => {
  Idea.findOne({
    // use findOne to return only 1 object with ID
    _id: req.params.id,
  }).then((ideaDB) => {
    // updating value
    ideaDB.title = req.body.title;
    ideaDB.details = req.body.details;

    // save updated ideaDB to mongoDB
    ideaDB.save().then(() => {
      /** 8. */
      req.flash("success_msg", "Note Updated!");
      /** end of 8. */
      res.redirect("/ideas");
    });
  });
};
