import express from "express";

import { checkAuth } from "../Middlewares/index.js";

import {
  create,
  remove,
  update,
  get,
  filter,
  show,
  advanceCalendarFilters,
  checkTrigger,
} from "../controllers/trigger/index.js";
import { triggerValidations } from "../validations/index.js";
import { dummy } from "../dummyData/trigger/index.js";
const router = express.Router();

router.use(checkAuth);

router.post("/", triggerValidations, create);
router.delete("/:id", remove);
router.put("/:id", triggerValidations, update);
router.get("/", get);
router.post("/create-dummy-triggers/:number", dummy);
router.post("/filter", filter);
router.post("/calendar/filters/:timeFrame", advanceCalendarFilters);
router.get("/:id", show);
router.post("/check-and-execute", checkTrigger);

const triggerRouter = express.Router();

triggerRouter.use(router);

export default triggerRouter;
