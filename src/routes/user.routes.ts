import { authJwt } from "../middlewares";
import * as controller from "../controllers/user.controller";
import { NextFunction, Request, Response, Router } from "express";

export const userRoutes = Router();

userRoutes.use((req: Request, res: Response, next: NextFunction) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept",
  );

  next();
});

userRoutes.get("/api/test/all", controller.allAccess);

userRoutes.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

userRoutes.get(
  "/api/test/mod",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.moderatorBoard
);

userRoutes.get(
  "/api/test/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.adminBoard
);