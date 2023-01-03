import { verifySignUp } from "../middlewares";
import * as controller from "../controllers/auth.controller";
import { NextFunction, Request, Response, Router } from "express";

module.exports = (app: Router) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept",
    );

    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRoleExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.signout);
};