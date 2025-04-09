import { Router } from "express";
import offsetController from "../controllers/offset.controller";

const offsetRouter = Router();

offsetRouter.route("/:orderId").get(offsetController.createOffset);

export default offsetRouter;
