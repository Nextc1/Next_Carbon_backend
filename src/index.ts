import cors from "cors";
import express from "express";
import { CONFIG } from "./lib/config";
import orderRouter from "./routes/order.routes";
import propertyRouter from "./routes/property.routes";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.json({
    message: "Hello from Nextcarbon!",
  });
});

// Load Routes
app.use("/api/orders", orderRouter);
app.use("/api/property", propertyRouter);

app.listen(CONFIG.port, () => {
  console.log(`Server online: http://localhost:${CONFIG.port}`);
});
