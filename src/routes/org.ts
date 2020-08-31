import express, { Response } from "express";
import axios from "axios";
import { dynamicsURL } from "../config/config";
import { getDynamicsAccessToken } from "../utils/utils";

const router = express.Router();

// @route   GET api/organizations
// @desc    Get a list of organizations from Dynamics
// @access  Public
router.get("/", async (_, res: Response) => {
  try {
    const token = await getDynamicsAccessToken();
    if (!token) {
      return res.status(400).json({
        errors: [{ msg: "Failed to get access token from MS Dynamics" }],
      });
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const URL = dynamicsURL + "/accounts?$select=name";
    const response = await axios.get(URL, config);

    if (response.data.value) {
      return res.json(response.data.value);
    }

    return res.status(404).json({
      errors: [{ msg: "Failed to get organizations" }],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error.");
  }
});

export default router;
