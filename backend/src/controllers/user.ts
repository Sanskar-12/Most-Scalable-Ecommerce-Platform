import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";

export const newUser = async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, photo, email, _id, dob, gender } = req.body;

    const user = await User.create({
      name,
      photo,
      email,
      _id,
      dob:new Date(dob),
      gender,
    });

    return res.status(200).json({
      success: true,
      message: `Created ${user.name}`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};
