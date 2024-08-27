import User from "../models/userModel.js";
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log("success")
    return res.status(200).json(users);;
  } catch (e) {
    res.status(404).send(e);
  }
};
export const postUser = async (req, res) => {
  const body = req.body;
  try {
    const result = await User.create({
      name: body.name,
      email: body.email,
      number: body.number,
    });
    console.log("User created successfully");
    return res.status(200).json(result);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleteid = await User.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      res.status(400).send();
    }
    res.send(deleteid);
    console.log("deleted successfully");
  } catch (e) {
    res.status(500).send(e);
  }
};

export const putUser = async (req, res) => {
  try {
    const userUp = await User.findByIdAndUpdate(req.params.id, req.body);
    res.send(req.body);
  } catch (e) {
    res.status(404).send(e);
  }
};
