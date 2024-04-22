import express from "express";

import { getRegister, postRegister, getLogin, postLogin, getLogout, 
    getProfile, postProfile, uploadAvatar, deleteProfile} 
from "../controllers/usersController.js";

/** 7. */
import ensureAuthenticated from "../helpers/auth.js";
/** end of 7. */

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


/** 7. */
router.get("/profile", ensureAuthenticated, getProfile);

router.post("/profile", ensureAuthenticated, uploadAvatar, postProfile);

router.delete("/profile", ensureAuthenticated, deleteProfile);

/** 4. */
// router.delete("/profile", deleteProfile);
/** end of 4. */

/** end of 7. */

export default router;