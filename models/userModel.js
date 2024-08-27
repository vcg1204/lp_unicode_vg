import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  number: {
    type: String,
  },
});
export default mongoose.model("users", userSchema);
