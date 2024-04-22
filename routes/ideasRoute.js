import express from "express";


import { getAddIdea, postAddIdea, getIdeas, 
    deleteIdea, getEditIdea, putEditIdea } 
from "../controllers/ideasController.js";


const router = express.Router();


router.get("/add", getAddIdea);

router.post("/add", postAddIdea);

router.get("/", getIdeas);

router.delete("/:id", deleteIdea);

// to get the page for editing "edit.handlebars"
// (:id) is the same as :id
router.get("/edit/(:id)", getEditIdea);

// to process the changed data of the idea from "edit.handlebars"
router.put("/edit/:id", putEditIdea);


export default router;