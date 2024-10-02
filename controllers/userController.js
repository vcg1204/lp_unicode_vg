import userModel from "../models/userModel.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import cloudinary from "../congfigure/cloudinary.js";
import path from "path";

//get the key
dotenv.config();
const Secret = process.env.secretkey;

//create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 465, //default port
  secure: true, //thus true else for any other port false
  auth: {
    user: process.env.Email,
    pass: process.env.Pass,
  },
});

//all users route
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find();
    console.log("All users found");
    return res.status(200).json(allUsers);
  } catch (err) {
    res.status(404).send(err);
  }
};

//signup route
export const signupUser = async (req, res) => {
  try {
    //get details from body
    const {
      fname,
      lname,
      username,
      email,
      password,
      resume,
      tech_stack,
      field_of_interest,
      experience_level,
      bio,
    } = req.body;
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    //hash the password
    const salt = await bcrypt.genSalt(120);
    const hashedPass = await bcrypt.hash(password, salt);

    const resumeinput = await cloudinary.uploader.upload(req.file.path, {
      folder: "resume",
    });
    //save new user in db
    const user = await userModel.create({
      fname,
      lname,
      username,
      email,
      password: hashedPass,
      resume: {
        resume_url: resumeinput.secure_url,
        public_id: resumeinput.public_id,
      },
      tech_stack: tech_stack.split(","),
      field_of_interest,
      experience_level,
      bio,
    });
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
//login route
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User doesnt exist" });
    }
    const match = await bcrypt.compare(password, user.password); //(input pw and exisiting pw of the user found by email)
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, Secret);
    const mailInfo = {
      to: email,
      from: process.env.Email,
      subject: "Using Nodemailer",
      text: "Successfully Logged In",
    };
    transporter.sendMail(mailInfo, (err, info) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Email could not be sent", err });
      } else {
        console.log("Email sent: " + info.response);
        res.json({ message: "Login successful", token });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
//update route
export const updateUser = async (req, res) => {
  try {
    const Updateid = await userModel.findByIdAndUpdate(req.params.id, req.body);
    return res.json({ message: "Successfully updated" }, Updateid);
  } catch (err) {
    return res.status(404);
  }
};
//delete route
export const deleteUser = async (req, res) => {
  try {
    const deleteid = await User.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      res.status(400).json({ message: "ID not found" });
    }
    res.json({ message: "Successfully deleted" }, deleteid);
  } catch (err) {
    return res.status(404);
  }
};

export const uploadImg = async (req, res) => {
  try {
    //file is not given
    if (!req.file) {
      return res.status(400).send("File not found");
    }
    //upload img
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploadedimages",
    });
    //find if user exists

    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    //else
    user.img.url = result.secure_url;
    user.img.public_id = result.public_id;
    await user.save();
    return res.status(200).json({
      message: "Image uploaded",
      Image: user.img,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error uploading image");
  }
};

export const updateImg = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId);
    //user isnt there
    if (!user) {
      return res.status(404).send("User not found");
    }
    //destroy existing user
    if (user.img && user.img.public_id) {
      await cloudinary.uploader.destroy(user.img.public_id);
    }
    //upload img
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploadedimages",
    });
    user.img.url = result.secure_url;
    user.img.public_id = result.public_id;
    await user.save();
    return res.status(200).json({
      message: "Image updated",
      Image: user.img,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error updating image");
  }
};
