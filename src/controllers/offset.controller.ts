import { Request, Response } from "express";
import offsetCreateSchema from "../schemas/offsetCreate.schema";
import { supabase } from "../lib/supabase";
import { offsetAgainstProject } from "../lib/ethers";
import { CONFIG } from "../lib/config";

class OffsetController {
  async offsetCredits(req: Request, res: Response) {
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
      const { data: ownerData, error: ownerError } = await supabase
        .from("owners")
        .select("*")
        .eq("user_id", data.userId)
        .eq("property_id", data.propertyId);

      const { data: propertyData, error: propertyError } = await supabase
        .from("property_data")
        .select("*")
        .eq("id", data.propertyId);

      if (!ownerData || ownerError || !propertyData || propertyError) {
        console.log(ownerError);
        console.log(propertyError);
        res.status(400).json({
          success: false,
          error: "Failed to offset credits",
        });
        return;
      }

      if (data.credits > ownerData[0].credits) {
        res.status(400).json({
          success: false,
          error: `You don't have enough credits. Available credits: ${ownerData[0].credits}`,
        });
        return;
      }

      const remainingCredits = ownerData[0].credits - data.credits;

      if (remainingCredits === 0) {
        const { error: deleteError } = await supabase
          .from("owners")
          .delete()
          .eq("user_id", ownerData[0].user_id)
          .eq("property_id", ownerData[0].property_id);

        if (deleteError) {
          console.log(deleteError);
          res.status(400).json({
            success: false,
            error: "Failed to offset credits",
          });
          return;
        }
      } else {
        const { error: updateError } = await supabase
          .from("owners")
          .update({
            credits: remainingCredits,
          })
          .eq("user_id", ownerData[0].user_id)
          .eq("property_id", ownerData[0].property_id);

        if (updateError) {
          console.log(updateError);
          res.status(400).json({
            success: false,
            error: "Failed to offset credits",
          });
          return;
        }

        // Offset credits in Blockchain
        let hash = "";
        try {
          hash = await offsetAgainstProject(
            data.credits,
            CONFIG.companyAddress,
            data.beneficiaryAddress,
            propertyData[0].name
          );
        } catch (error) {
          console.log(`Offset error: ${error}`);
          if (remainingCredits === 0) {
            // Restore the deleted record
            await supabase.from("owners").insert({
              id: propertyData[0].id,
              user_id: ownerData[0].user_id,
              property_id: ownerData[0].property_id,
              credits: data.credits,
            });
          } else {
            // Restore the original credits
            await supabase
              .from("owners")
              .update({ credits: ownerData[0].credits })
              .eq("user_id", ownerData[0].user_id)
              .eq("property_id", ownerData[0].property_id);
          }
        }

        if (hash !== "" || hash !== null) {
          const { data: dbData, error: dbError } = await supabase
            .from("offset")
            .insert([
              {
                user_id: data.userId,
                property_id: data.propertyId,
                credits: data.credits,
                description: data.description,
                transaction_hash: hash,
                beneficiary_address: data.beneficiaryAddress,
                beneficiary_name: data.beneficiaryName,
              },
            ])
            .select();

          if (dbData) {
            res.status(200).json({
              success: true,
              message: `Offsetted ${data.credits} successfully`,
            });
          } else {
            console.log(dbError);
            console.log(error);

            res.status(400).json({
              success: false,
              error: "Failed to offset credits",
            });

            return;
          }
        }
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
