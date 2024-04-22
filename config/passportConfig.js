import {Strategy as LocalStrategy} from "passport-local";
import bcrypt from "bcryptjs";
import User from "./../models/Users.js"


// refer to https://www.passportjs.org/packages/passport-local/

export default function (passport) {
    passport.use( new LocalStrategy( 
        { usernameField : "emailInput", passwordField: "passwordInput" },       // "emailInput" refers to <input> in 'login.handlebars'
        function (emailInput, passwordInput, done)  {
            // console.log("passportConfig.js: ", emailInput, passwordInput);    // if this part is working, then this line should output the variable on console
            // Match user based on email
            User.findOne({
                email : emailInput,
            }).then( (user) => {
                if (!user) {
                    // in case cannot find user in MongoDB
                    return done(null, false, { type : "fail_passport", message : "No User Found" });
                    /** 
                    explaination on done function: 
                    there are 3 parameters in done function: 
                        error:      set null since there is no error 
                        user:       set false since there is no user found 
                        options:    set {message} for later display on the webpage
                                    set {type : "fail_passport"} --> 
                                        {message : "xxx"} will be called by req.flash("fail_passport") 
                    */ 
                }
                
                // if user is found then check password
                // compare passwordInput vs MongoDB user password, pass isMatch to the callback function 
                bcrypt.compare(passwordInput, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        // in case password is correct
                        return done(null, user);
                        /** 
                        explaination on done function: 
                        there are 3 parameters in done function: 
                            error:      set null since there is no error 
                            user:       set user, to return user information 
                            options:    can be ignored
                        */ 
                    } else {
                        // in case password is incorrect
                        return done(null, false, { type : "fail_passport", message : "Password Incorrect" })
                        /** 
                        explaination on done function: 
                        there are 3 parameters in done function: 
                            error:      set null since there is no error 
                            user:       set false since user cannot login 
                            options:    set {type : "fail_passport"} --> 
                                            {message : "xxx"} will be called by req.flash("fail_passport")

                        */ 
                    }
                });
            });
        })
    );

    /** 3. */
    // for session and maintain cookies in server 
    passport.serializeUser(function (user, done) {
        // only store the id of the user in login session
        done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
        // find the user information in mongoDB with the id in login session
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    /** end of 3. */
}
