import { Router } from "express";
import orderController from "../controllers/order.controller";

const orderRouter = Router();

orderRouter.post("/create", orderController.createOrder);
orderRouter.get("/:orderId", orderController.getOrderById);
orderRouter.post("/create", orderController.createOrder);
orderRouter.post("/verify", orderController.verifyOrder);

export default orderRouter;
