import { verifySignUp } from "../middlewares";
import * as controller from "../controllers/auth.controller";
import { NextFunction, Request, Response, Router } from "express";

export const authRoutes = Router();

authRoutes.use((req: Request, res: Response, next: NextFunction) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept",
  );

  next();
});

authRoutes.post(
  "/api/auth/signup",
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRoleExisted
  ],
  controller.signup
);

authRoutes.post("/api/auth/signin", controller.signin);

authRoutes.post("/api/auth/signout", controller.signout);