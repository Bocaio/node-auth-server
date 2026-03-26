import { ErrorRequestHandler } from "express";
import { AppError } from "../types/AppError.js";

const errorMiddleWare: ErrorRequestHandler = (error, req, res, next) => {
    console.log("Error is : ", error)
    if (error.code && error.errno) {
        switch (error.code) {
            case "ER_DUP_ENTRY":
                const dupMatch = error.sqlMessage?.match(/Duplicate entry '(.+)' for key '(.+)'/);
                const dupValue = dupMatch?.[1];
                res.status(409).send({
                    message: `${dupValue} already exists`,
                });
                return;
            case "ER_NO_SUCH_TABLE":
                console.log("No Table is found in Database")
                res.status(500).send({ message: "Internal Server Error" });
                return;
            case "ER_BAD_FIELD_ERROR":
                console.log("That field doesn't exist")
                res.status(400).send({ message: "Bad Request" });
                return;
            case "ER_DATA_TOO_LONG":
                res.status(400).send({ message: "Your Input is too long" });
                return;
            case "ER_ACCESS_DENIED_ERROR":
                console.log("Database access denied")
                res.status(500).send({ message: "Internal Server Error" });
                return;
            case "ECONNREFUSED":
                console.log("Database connection refused")
                res.status(503).send({ message: "Internal Server Error" });
                return;
            default:
                console.log("Database Error")
                res.status(500).send({ message: "Internal Server Error" });
                return;
        }
    }

    if (error instanceof AppError) {
        res.status(error.statusCode).send({ message: error.message })
        return;
    }

    res.status(500).send({ message: "Internal server error" });
}

export default errorMiddleWare;