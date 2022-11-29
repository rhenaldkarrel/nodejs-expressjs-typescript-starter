import db from "../models";
import type { Request, Response, NextFunction } from "express";

const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (user) {
      return res.status(400).send({ message: 'Failed! Username is already in use!'});
    }

    // email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      if (user) {
        return res.status(400).send({ message: 'Failed! Email is already in use!'});
      }

      next();
    });
  });
};

const checkRoleExisted = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.roles) {
    for (const role of req.body.roles) {
      if (!ROLES.includes(role)) {
        return res.status(400).send({ message: `Failed! Role ${role} doesn't exist!`});
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRoleExisted,
};

export default verifySignUp;