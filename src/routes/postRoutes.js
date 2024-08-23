import express from "express";
import {
  create,
  update,
  remove,
  get,
  filter,
  applyCalendarFilters,
} from "../controllers/post/index.js";
import { postValidations } from "../validations/index.js";
import { dummy } from "../dummyData/post/index.js";

import { checkAuth } from "../Middlewares/index.js";
const router = express.Router();
router.use(checkAuth);
router.post("/", postValidations, create);
router.put("/:id", postValidations, update);
router.delete("/:id", remove);
router.get("/:id", get);
router.post("/filter", filter);

router.post("/calendar/filters/:timeFrame", applyCalendarFilters);
router.post("/create-dummy-posts/:number/:minutesAhead", dummy);
const postRouter = express.Router();

postRouter.use(router);

export default postRouter;
