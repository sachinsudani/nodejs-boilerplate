import bcrypt from "bcryptjs";
import { RequestHandler } from "express";
import { HttpStatus } from "../../enums";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { IUser, User } from "../../models/user.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { AuthMessage } from "./content";
import { registerSchema } from "./validators/register.validator";

const register: RequestHandler = asyncHandler(async (req, res, _next) => {
    const payload = registerSchema.parse(req.body);

    const user = await User.findOne({ email: payload.email }).select("_id");

    if (user) {
        throw new ApiError(HttpStatus.CONFLICT, AuthMessage.UserAlreadyExists);
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const newUser = new User({ name: payload.name, email: payload.email, password: hashedPassword });
    await newUser.save();

    const { password, ...newUserWithoutPassword } = newUser.toObject();
    const response = newUserWithoutPassword as IUser;

    res.status(201).json(new ApiResponse(HttpStatus.CREATED, response, AuthMessage.RegisterSuccess));
});

export { register };
