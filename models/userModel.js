import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    url: {
      type: String,
      default: "",
    },
    public_id: {
      type: String,
      default: "",
    },
  },
  resume: {
    resume_url: {
      type: String,
      default: "",
    },
    public_id: {
      type: String,
      default: "",
    },
  },
  tech_stack: {
    type: [String],
    required: true,
  },
  field_of_interest: {
    type: String,
    required: true,
  },
  experience_level: {
    type: String,
  },
  bio: {
    type: String,
    default : "",
  },
});
export default mongoose.model("User", userModel);
