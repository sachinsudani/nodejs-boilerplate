import bcrypt from "bcryptjs";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { HttpStatus } from "../../enums";
import { IUser, User } from "../../models/user.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { AuthMessage } from "./content";
import { loginSchema } from "./validators/login.validator";

const login: RequestHandler = (async (req, res, _next) => {
    const payload = loginSchema.parse(req.body);
    const user = await User.findOne({ email: payload.email }, { password: 1 });

    if (!user) {
        throw new ApiError(HttpStatus.NOT_FOUND, AuthMessage.EmailNotRegistered);
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, AuthMessage.InvalidCredentials);
    }

    const token = generateAccessToken(user);

    res.status(200).json(new ApiResponse(HttpStatus.OK, { token }, AuthMessage.LoginSuccess));
});

const generateAccessToken = (user: IUser) => {
    return jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

export { login };

