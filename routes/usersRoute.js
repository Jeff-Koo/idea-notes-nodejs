import express from "express";

import { getRegister, postRegister, getLogin, postLogin, getLogout, 
    getProfile, postProfile, uploadAvatar} 
from "../controllers/usersController.js";

const router = express.Router();

// since we are in usersRoute, the route changed from "/users/register" --> "/register"
// the part "/user" will be handled in 'app.js'

// router.get("/register", getRegister);
// router.post("/register", postRegister);
router.route("/register").get(getRegister).post(postRegister);

// router.get("/login", getLogin);
// router.post("/login", postLogin);
router.route("/login").get(getLogin).post(postLogin);

// router.get("/logout", getLogout);
router.route("/logout").get(getLogout);

router.get("/profile", getProfile);

/** 2. */
// router.post("/profile", postProfile);
/** end of 2. */


/** 9. */
router.post("/profile", uploadAvatar, postProfile);
/** end of 9. */


export default router;