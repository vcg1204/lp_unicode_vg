import mongoose from "mongoose";

const companyModel = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  website_url: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
  },
});
export default mongoose.model("Company", companyModel);
