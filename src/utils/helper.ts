import { Response } from "express";
import { CONFIGS } from "../config/index.js";

export const successHandler = (res: Response, data: any, type: any) => {
    const isProducion = CONFIGS.NODE_ENV === "production";
    switch (type) {
        case "create":
            res.status(201).send({ message: "create successfully", data });
            break;
        case "login":
            res.cookie("accessToken", data.accessToken, {
                httpOnly: true,
                secure: isProducion,
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            });
            res.cookie("refreshToken", data.refreshToken, {
                httpOnly: true,
                secure: isProducion,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).send({ message: "login successful", user: data.user });
            break;
        case "google-login":
            res.cookie("accessToken", data.accessToken, {
                httpOnly: true,
                secure: isProducion,
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
            });
            res.cookie("refreshToken", data.refreshToken, {
                httpOnly: true,
                secure: isProducion,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.redirect("http://localhost:5173");
            break;
        case "health":
            res.status(200).send({ message: "Yeah! You exists", user: data })
            break;
        default:
            res.status(200).send({ message: "success", data });
            break;
    }
}

