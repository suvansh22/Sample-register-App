import mongoose from "mongoose";

const Schema = mongoose.Schema;
mongoose.connect(process.env.DB_URI);
mongoose.Promise = global.Promise;

export const db = {
  User: userModel(),
};

// mongoose models with schema definitions

function userModel() {
  const schema = new Schema(
    {
      email: { type: String, unique: true, required: true },
      password: { type: String, required: true },
    },
    {
      // add createdAt and updatedAt timestamps
      timestamps: true,
    }
  );

  return mongoose.models.User || mongoose.model("User", schema);
}
