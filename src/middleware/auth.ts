import { Response, NextFunction } from "express";
import { CustomRequest, AuthToken } from "../types/interface";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config";
import { parseBearerToken } from "../utils/utils";

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const bearerToken = req.header("authorization");

  if (!bearerToken) {
    return res
      .status(401)
      .json({ msg: "No bearer token found, authorization denied." });
  }

  try {
    const token = parseBearerToken(bearerToken);
    const decodedToken = jwt.verify(token, jwtSecret) as AuthToken;
    req.user = decodedToken.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid JWT token" });
  }
};

export default auth;
