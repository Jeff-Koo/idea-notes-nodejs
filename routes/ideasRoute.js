/** 3. */
import express from "express";
/** end of 3. */

/** 5. */
import { getAddIdea, postAddIdea, getIdeas, 
    deleteIdea, getEditIdea, putEditIdea } 
from "../controllers/ideasController.js";
/** end of 5. */

/** 6. */
const router = express.Router();
/** end of 6. */

/** 4. + 6. + 7. */
router.get("/add", getAddIdea);

router.post("/add", postAddIdea);

router.get("/", getIdeas);

router.delete("/:id", deleteIdea);

// to get the page for editing "edit.handlebars"
// (:id) is the same as :id
router.get("/edit/(:id)", getEditIdea);

// to process the changed data of the idea from "edit.handlebars"
router.put("/edit/:id", putEditIdea);
/** end of 4. + 6. + 7. */

/** 8. */
export default router;
/** end of 8. */
