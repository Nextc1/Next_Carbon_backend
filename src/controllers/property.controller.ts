import type { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import {
  deletePropertySchema,
  propertyCreateSchema,
} from "../schemas/property.schema";

class PropertyController {
  async getAllProperties(_req: Request, res: Response) {
    const { data, error } = await supabase
      .from("property_data")
      .select("*")
      .single();

    if (!data) {
      res.status(400).json({
        success: false,
        error,
      });

      return;
    }

    res.json({
      success: true,
      data,
    });
  }

  async getPropetyById(req: Request, res: Response) {
    const propertyId = req.params.propertyId;

    const { data, error } = await supabase
      .from("property_data")
      .select("*")
      .eq("id", propertyId);

    if (!data || error) {
      res.status(400).json({
        success: false,
        error: "No property found with that id",
      });

      return;
    }

    res.json({
      success: true,
      data,
    });
  }

  async createProperty(req: Request, res: Response) {
    const { success, data, error } = propertyCreateSchema.safeParse(req.body);

    if (!success) {
      res.json({
        success: false,
        error,
      });

      return;
    }

    const { data: dbData } = await supabase
      .from("property_data")
      .insert([
        {
          name: data?.name,
          status: data?.status,
          price: data?.price,
          available_shares: data?.availableShares,
          location: data?.location,
          type: data?.type,
          image: data?.image,
          attributes: data?.attributes,
          value_parameters: data?.valueParameters,
          updates: data?.updates,
          growth: data?.growth,
          description: data?.description,
        },
      ])
      .select();

    res.json({
      success: true,
      message: "Created new properties.",
      data: dbData,
    });
  }

  async deleteProperty(req: Request, res: Response) {
    const { success, data, error } = deletePropertySchema.safeParse(req.body);

    if (!success) {
      res.json({
        success: false,
        error,
      });

      return;
    }

    const { data: dbData, error: dbError } = await supabase
      .from("property_data")
      .delete()
      .eq("id", data.id)
      .select();

    if (!data) {
      res.json({
        success: false,
        error: dbError,
      });

      return;
    }

    res.json({
      success: true,
      data: dbData,
    });
  }
}

export default new PropertyController();
