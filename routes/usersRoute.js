import express from "express";


const router = express.Router();

// since we are in usersRoute, the route changed from "/users/register" --> "/register"
// the part "/user" will be handled in 'app.js'

router.get("/register", (req, res) => {
    res.render("users/register");   // follow file structure, start from 'views' folder
});

router.post("/register", (req, res) => {
    // name, email, password, password2 from <form> in 'register.handlebars'
    
    let errors = []         // will pass to '_errors.handlebars' when render the page 
    if (!req.body.name) {
        errors.push({text: "Name is missing!"});
    }
    if (!req.body.email) {
        errors.push({text: "Email is missing!"});
    }
    if (req.body.password != req.body.password2) {
        errors.push({text: "Passwords do not match!"});
    }
    if (req.body.password.length < 4) {
        errors.push({text: "Password must be at least 4 characters!"});
    }

    // if there is invalid input, 
    // render the register page with error messages and the user input 
    if (errors.length > 0) {
        res.render("users/register", {
            errors : errors,
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            password2 : req.body.password2,
        })
    } else {
        // later we will check whether the email is already registered

        // for now: if input ok, then register the user, save data in mongoDB (in the next Step)
        res.redirect("/");
    }

});

export default router;