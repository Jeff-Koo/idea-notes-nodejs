import express from "express";

/** 2. */
import bcrypt from "bcryptjs";

import User from "../models/Users.js";
/** end of 2. */

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

        
        // if input ok, then register the user, save data in mongoDB (in the next Step)
        // make a variable 'newUser' which is 'User' type 
        // only the type defined with Scheme can use "save()" function
        const newUser = new User({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
        });

        /** 3. */
        // generate salt with saltRound = 10, pass the salt to callback function
        bcrypt.genSalt(10, (err, salt) => {

            // calculate hash of the password with salt, pass the calculated hash to callback function 
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;

                // put the hash into 'password' field and save the 'newUser' into mongoDB
                newUser.password = hash;
                newUser.save()
                    .then( () => {
                        /** 4. */
                        // give the sucess message and redirect to login page (have not set yet)
                        req.flash("success_msg", "Regsiter Done!");
                        res.redirect("/users/login");
                        /** end of 4. */
                    })
                    .catch((err) => {
                        // in case the document cannot save into mongoDB
                        console.log(err);
                        req.flash("error_msg", "Server went wrong!");
                        res.redirect("/users/register");
                        return;
                    });
            });
        });
        
        /** end of 3. */
    }


});

export default router;