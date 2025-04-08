import { Request, Response } from "express";
import offsetCreateSchema from "../schemas/offsetCreate.schema";
import { supabase } from "../lib/supabase";

class OffsetController {
  async createOffset(req: Request, res: Response) {
    const { success, data, error } = offsetCreateSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        success: false,
        message: error.message,
        error,
      });

      return;
    }

    try {
      const { data: dbData, error: dbError } = await supabase
        .from("offset")
        .insert([
          {
            user_id: data.userId,
            property_id: data.propertyId,
            credits: data.credits,
            description: data.description,
            transaction_hash: data.transactionHash,
            beneficiary_address: data.beneficiaryAddress,
            beneficiary_name: data.beneficiaryName,
          },
        ])
        .select();

      if (dbData) {
        res.status(200).json({
          success: true,
          message: "Offset created successfully",
        });
      } else {
        console.log(dbError);
        console.log(error);

        res.status(400).json({
          success: false,
          error: "Failed to create the offset",
        });

        return;
      }
    } catch (error) {
      console.log("Failed to create order:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}

export default new OffsetController();
