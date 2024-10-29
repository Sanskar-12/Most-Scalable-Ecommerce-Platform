import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { name, photo, email, _id, dob, gender } = req.body;

    const user = await User.create({
      name,
      photo,
      email,
      _id,
      dob: new Date(dob),
      gender,
    });

    return res.status(200).json({
      success: true,
      message: `Created ${user.name}`,
    });
  }
);
