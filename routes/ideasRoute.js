import express from "express";

import { getAddIdea, postAddIdea, getIdeas, 
    deleteIdea, getEditIdea, putEditIdea } 
from "../controllers/ideasController.js";


const router = express.Router();


// router.get("/add", getAddIdea);
// router.post("/add", postAddIdea);
router.route("/add").get(getAddIdea).post(postAddIdea);



// import ensureAuthenticated from "../helpers/auth.js";
// router.route("/add").get(ensureAuthenticated, getAddIdea).post(ensureAuthenticated, postAddIdea);




// router.get("/", getIdeas);
router.route("/").get(getIdeas);

// router.delete("/:id", deleteIdea);
router.route("/:id").delete(deleteIdea);



// to get the page for editing "edit.handlebars"
// (:id) is the same as :id
// router.get("/edit/(:id)", getEditIdea);

// to process the changed data of the idea from "edit.handlebars"
// router.put("/edit/:id", putEditIdea);

router.route("/edit/:id").get(getEditIdea).put(putEditIdea);

export default router;