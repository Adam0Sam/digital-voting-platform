import { User } from "../user/index.js";
import { Action } from "./actions.js";

export type ActionLog = {
  id: string;
  action: Action;
  userAgent?: string;
  message?: string;
  time: Date;
  user?: User;
  userId?: string;
};
