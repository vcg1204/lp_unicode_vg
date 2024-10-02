import companyModel from "../models/companyModel.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const Secret = process.env.secretkey;

export const sinupCompany = async (req, res) => {
  try {
    const { email, password, name, website_url, description } = req.body;
    const emailExists = await companyModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Company already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newCompany = await companyModel.create({
      email,
      password: hashedPass,
      name,
      website_url,
      description,
    });
    return res
      .status(200)
      .json({ newCompany, message: "Company created successfully" });
  } catch (error) {
    console.error("Signup error", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;
    const companyExists = await companyModel.findOne({ email });
    if (!companyExists) {
      return res.status(400).json({ message: "Company doesn't exist" });
    }
    const match = await bcrypt.compare(password, companyExists.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ companyId: companyExists._id }, Secret);
    return res.status(201).json({ token, companyExists });
  } catch (error) {
    console.error("Login error", error);
    return res.status(500).json({ message: "Server error" });
  }
};
