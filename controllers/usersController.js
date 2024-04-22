import bcrypt from "bcryptjs";
import passport from "passport";
import multer from "multer";
import * as fs from "fs";

import User from "../models/Users.js";

const storageSetting = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename : (req, file, cb) => {
        cb(null, file.originalname);
    },
});


export const uploadAvatar = multer({ 
    storage: storageSetting,
    fileFilter : (req, file, cb) => {
        const mimetype = file.mimetype;
        if (
            mimetype === "image/png" ||
            mimetype === "image/jpg" ||
            mimetype === "image/jpeg" || 
            mimetype === "image/gif"
        ) {
            // only accept jpeg, jpg, png, gif
            cb(null, true);
        } else {
            // not allow other file types 
            // flash an error message to user 
            req.flash("error_msg", "Wrong file type for avatar! ");
            cb(null, false);
        }
    }
}).single("avatarUpload");  // "avatarUpload" refers to <input> in 'profile.handlebars'


export const postProfile = (req, res) => {
    
    // use findOne to return only 1 object 
    User.findOne({ _id : res.locals.user._id })
    .then( (user) => {

        if (req.file) {
            // in case there is file to be uploaded 

            // two variables for storing the information of the avatar image 
            // when fs.readFileSync() is called, NodeJS will wait for fs.readFileSync() to get executed 
            // req.file.path  refers to  "/uploads/<filename>"
            let avatarData = fs.readFileSync(req.file.path).toString("base64");
            let avatarContentType = req.file.mimetype;
    
    
            user.avatar.data = avatarData;
            user.avatar.contentType = avatarContentType;

            /** 6. */
            // after getting the data of the image file, 
            // delete the temporate file in folder 'uploads'
            fs.unlink(req.file.path, (err) => {
                if (err) throw err;
            });
            /** end of 6. */

            user.save().then( ()=> {
                req.flash("success_msg", "avatar uploaded!")
                res.redirect("/users/profile")
            });
        } else {
            // in case there is no file, but clicked the 'Upload Avatar' button
            req.flash("error_msg", "Choose a Correct File before clicking 'Upload Avatar' button!")
            res.redirect("/users/profile");
        }
    });
    
};

/** 5. */
export const deleteProfile = (req, res) => {
    User.updateOne(
        { _id : res.locals.user._id },
        { $unset: { avatar : "" } }
    ).then( ()=> {
        req.flash("success_msg", "Delete Avatar Successfully!");
        res.redirect("/users/profile")
    });
};
/** end of 5. */



export const getRegister = (req, res) => {
    res.render("users/register");   // follow file structure, start from 'views' folder
};

export const postRegister = (req, res) => {
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
        // check whether the email is already registered
        // find the input email in mongoDB
        User.findOne({email: req.body.email}).then( (user) => {
            if (user) {
                // if there is result return from mongoDB, the email exists in mongoDB
                // the email is registered, show error message 
                req.flash("error_msg", "Email already regsitered ! ");
                res.redirect("/users/register");
            }
        });
        
        // if input ok, then register the user, save data in mongoDB (in the next Step)
        // make a variable 'newUser' which is 'User' type 
        // only the type defined with Scheme can use "save()" function
        const newUser = new User({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
        });

        // generate salt with saltRound = 10, pass the salt to callback function
        bcrypt.genSalt(10, (err, salt) => {

            // calculate hash of the password with salt, pass the calculated hash to callback function 
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;

                // put the hash into 'password' field and save the 'newUser' into mongoDB
                newUser.password = hash;
                newUser.save()
                    .then( () => {
                        // give the sucess message and redirect to login page (have not set yet)
                        req.flash("success_msg", "Regsiter Done!");
                        res.redirect("/users/login");
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
        
    }
};

export const getLogin = (req, res) => {
    res.render("users/login");
};

export const postLogin = (req, res, next) => {
    passport.authenticate("local", {            // local follow  {Strategy as LocalStrategy} from "passport-local" 
        successRedirect : "/ideas",
        failureRedirect : "/users/login",
        failureFlash : true,                    // turn on flash, to make fail_passport message
    })(req, res, next);                         // IIFE 
};

export const getLogout = (req, res) => {
    req.logout( (err) => {
        if (err) throw err; 
    });
    req.flash("success_msg", "You're logged out!");
    res.redirect("/users/login")
};

export const getProfile = (req, res) => {
    res.render("users/profile", { 
        name : res.locals.user.name,
        email : res.locals.user.email,
        /** 2.  */
        avatar : res.locals.user.avatar,
        /** end of 2.  */
    });
};

