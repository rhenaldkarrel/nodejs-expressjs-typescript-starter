import mongoose from "mongoose";
import user from "./user.model";
import role from "./role.model";

mongoose.Promise = global.Promise;

const db = {
  mongoose,
  user,
  role,
  ROLES: ['user', 'admin', 'moderator'],
};

export default db;