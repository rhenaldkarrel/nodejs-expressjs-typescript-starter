import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import authConfig from "../config/auth.config";
import db from "../models";
import type { Response, Request, NextFunction } from "express";

const User = db.user;
const Role = db.role;

export interface IAuthJwtRequest extends Request {
  userId: string | JwtPayload | undefined;
}

const verifyToken = (
  req: IAuthJwtRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.session?.token as string;

    if (!token) {
      return res.status(403).send({ message: 'No token provided!' });
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Unauthorized!' });
      }

      req.userId = decoded;
      next();
    });
  } catch(err) {
    return res.status(401).send({ message: 'Please authenticate!'});
  }
};

const isAdmin = (
  req: IAuthJwtRequest,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.userId)
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      Role.find({
          _id: { $in: user?.roles },
      }).exec((err, roles) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        for (const role of roles) {
          if (role.name === "admin") {
            next();
            return;
          }
        }

        return res.status(403).send({ message: "Require Admin role!" });
      });
    });
};

const isModerator = (
  req: IAuthJwtRequest,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.userId)
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      Role.find({
        _id: { $in: user?.roles },
      }).exec((err, roles) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        for (const role of roles) {
          if (role.name === 'moderator') {
            next();
            return;
          }
        }

        return res.status(403).send({ message: "Require Moderator role!"});
      });
    });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};

export default authJwt;