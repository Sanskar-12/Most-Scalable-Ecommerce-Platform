import { User } from "../models/user.js";
export const newUser = async (req, res, next) => {
    try {
        const { name, photo, email, _id, dob, gender } = req.body;
        const user = await User.create({
            name,
            photo,
            email,
            _id,
            dob,
            gender,
        });
        return res.status(200).json({
            success: true,
            message: `Created ${user.name}`,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error",
        });
    }
};
