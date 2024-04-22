// add passport function to protect the routes 
// connect to next middleware
export default function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // if user is not logged in, 
    // show error message and redirect to 'Login page' 
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
}
