import authConfig from "../config/auth.config";
import db from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";

const User = db.user;
const Role = db.role;

export const signup = (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const user = new User({
    username,
    email,
    password: bcrypt.hashSync(password, 8),
  });

  user.save((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (req.body.roles) {
      Role.find({
        name: { $in: req.body.roles },
      }).exec((err, roles) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        user.roles = roles.map(role => role._id);
        user.save(err => {
          if (err) {
            return res.status(500).send({ message: err });
          }

          res.send({ message: 'User was registered successfully!' });
        });
      });
    } else {
      Role.findOne({ name: 'user' })
        .exec((err, role) => {
          if (err) {
            return res.status(500).send({ message: err });
          }

          if (role) {
            user.roles = [role._id];
            user.save(err => {
              if (err) {
                return res.status(500).send({ message: err });
              }

              res.send({ message: 'User was registered successfully!'});
            });
          }
        });
    }
  });
};

export const signin = (req: Request, res: Response) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password || "",
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid password!" });
      }

      const token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400,
      });

      const authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUppercase());
      }

      if (req.session) {
        req.session.token = token;
      }

      return res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
      });
    });
};

export const signout = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch(err) {
    next(err);
  }
};