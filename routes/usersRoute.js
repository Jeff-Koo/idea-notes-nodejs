import express from "express";

/** 6.remove unused modules, packages + 7.  */
import { getRegister, postRegister, getLogin, postLogin, getLogout } 
from "../controllers/usersController.js";
/** end of 6. + 7. */ 

const router = express.Router();

// since we are in usersRoute, the route changed from "/users/register" --> "/register"
// the part "/user" will be handled in 'app.js'

router.get("/register", getRegister);

router.post("/register", postRegister);

router.get("/login", getLogin);

router.post("/login", postLogin);

router.get("/logout", getLogout);

export default router;