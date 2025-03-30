import { config } from "dotenv";

config();

export const CONFIG = {
  port: process.env.PORT || 3000,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? "",
  razorpaySecret: process.env.RAZORPAY_SECRET ?? "",
  supabaseUri: process.env.SUPABASE_URI ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
};
