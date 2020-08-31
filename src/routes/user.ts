import express, { Response } from "express";
import { CustomRequest } from "../types/interface";
import { generateToken, getPasswordHash } from "../utils/utils";
import userModel from "../models/user";

const router = express.Router();

// @route   POST api/user
// @desc    Register user
// @access  Public
router.post("/", async (req: CustomRequest, res: Response) => {
  const { email, name, password, role } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: ["User exists already"] });
    }

    user = new userModel({
      email,
      name,
      password,
      role,
    });

    // Encrypt user password
    user.password = await getPasswordHash(password);

    // Save to DB
    const registeredUser = await user.save();

    // Gen token
    const token = await generateToken(
      registeredUser.name,
      registeredUser.id,
      registeredUser.email,
      registeredUser.role
    );

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error.");
  }
});

// @route   POST api/user
// @desc    Get users
// @access  Public
router.get("/", async (_, res: Response) => {
  try {
    const users = await userModel.find().populate("user");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error.");
  }
});

export default router;
