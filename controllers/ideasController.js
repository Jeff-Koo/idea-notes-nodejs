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
      userID : res.locals.user._id, // get the user._id which stored in express-session 
    };

    new Idea(newUser).save().then(() => {
      req.flash("success_msg", "Note Added!");
      res.redirect("/ideas"); // redirect refers to the route defined : app.get('xxx')
    });
  }
};

export const getIdeas = (req, res) => {
  Idea.find( {userID : res.locals.user._id} ) // getting the result in 'ideas' collection by using find()
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
    req.flash("error_msg", "Note Deleted!")
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

    // req.flash only handle a string, so we do not use array here
    let edit_error_msg = "";
    if (!req.body.title) {
      edit_error_msg += "Please add a title. ";
    }
    if (!req.body.details) {
      edit_error_msg += "Please add some details. "
    }
    
    // use if-else statement, place update value in else part 
    if (edit_error_msg) {
      // if there is errors, edit_error_msg is not empty
      req.flash("error_msg", edit_error_msg);

      // redirect to route "/ideas/edit/:id"
      res.redirect("/ideas/edit/"+ideaDB._id);

    } else {

      // updating value
      ideaDB.title = req.body.title;
      ideaDB.details = req.body.details;
  
      // save updated ideaDB to mongoDB
      ideaDB.save().then(() => {
        req.flash("success_msg", "Note Updated!");
        res.redirect("/ideas");
      });

    }

  });
};


// write the function for getting data from mongoDB 
//                        and rendering 'records.handlebars'
export const getRecords = (req, res) => {

  // use $lookup in aggregate to link two collections, to get the author name
  Idea.aggregate([
      { $lookup :
          // show the data  where  users._id === ideas.userID
          {
              from: "users",          // link to 'users' collection in mongoDB
              localField: "userID",   // 'userID' is the field in 'ideas'
              foreignField: "_id",    // '_id' is the field in 'users'
              as: "userInfo",
              // put the information from 'users' collection to the field called 'userInfo'
          }
      },
      { $unwind : 
          {
              path: "$userInfo",                    // "$" is needed
              preserveNullAndEmptyArrays: true,     // in case there is a note and its author's account is deleted.  
          }
      }, 
      { $sort : 
          {
              "date" : -1,            // date in descending order (notes sorted from new to old)
          }
      }
  ])
  .then( (recordsDB) => {
      // console.log(recordsDB[0].userInfo.name);
      res.render("ideas/records", {records : recordsDB});
      // records --> 'ideas/index.handlebars'(records) : recordsDB --> array of document objects from mongoDB
  })
};
