import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import { invalidateCache } from "../utils/features.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { name, photo, email, _id, dob, gender } = req.body;

    let user = await User.findById(_id);

    if (user) {
      return res.status(200).json({
        success: true,
        message: `Welcome ${user.name}`,
      });
    }

    if (!_id || !name || !photo || !email || !dob || !gender) {
      return next(new ErrorHandler("Please fill all fields", 400));
    }

    user = await User.create({
      name,
      photo,
      email,
      _id,
      dob: new Date(dob),
      gender,
    });

    await invalidateCache({ admin: true });

    return res.status(200).json({
      success: true,
      message: `Welcome ${user.name}`,
    });
  }
);

export const getAllUsers = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});

    return res.status(200).json({
      success: true,
      users,
    });
  }
);

export const getUserDetails = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) return next(new ErrorHandler("Invalid Id", 400));

    return res.status(200).json({
      success: true,
      user,
    });
  }
);

export const deleteUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) return next(new ErrorHandler("Invalid Id", 400));

    await user.deleteOne();

    await invalidateCache({ admin: true });

    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  }
);
