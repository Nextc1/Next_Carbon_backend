import cors from "cors";
import express from "express";
import { CONFIG } from "./lib/config";
import orderRouter from "./routes/order.routes";
import propertyRouter from "./routes/property.routes";
import offsetRouter from "./routes/offset.routes";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));

app.options("*", cors());

app.get("/", (_req, res) => {
  res.json({
    message: "Hello from Next Carbon!",
  });
});

// Load Routes
app.use("/api/orders", orderRouter);
app.use("/api/property", propertyRouter);
app.use("/api/offset", offsetRouter);

app.listen(CONFIG.port, () => {
  console.log(`Server online: http://localhost:${CONFIG.port}`);
});
