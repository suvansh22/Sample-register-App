import bcrypt from "bcryptjs";
import { db } from "./db";
const User = db.User;
export async function create(params) {
  // validate
  const paramsJson = JSON.parse(params);
  if (await User.findOne({ email: paramsJson.email })) {
    throw 'Username "' + paramsJson.email + '" is already taken';
  }

  const user = new User(paramsJson);

  // hash password
  if (paramsJson.password) {
    user.password = bcrypt.hashSync(paramsJson.password, 10);
  }

  // save user
  await user.save();
}
