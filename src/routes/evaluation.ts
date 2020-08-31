import express, { Response } from "express";
import axios from "axios";
import { dynamicsURL } from "../config/config";
import { CustomRequest } from "../types/interface";
import { getDynamicsAccessToken, Role } from "../utils/utils";
import auth from "../middleware/auth";

const router = express.Router();

// @route   GET api/evaluation
// @desc    Get a list of evaluations from Dynamics
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

    const URL = dynamicsURL + "/fsc_evaluations";
    const response = await axios.get(URL, config);

    if (response.data.value) {
      return res.json(response.data.value);
    }

    return res.status(404).json({
      errors: [{ msg: "Failed to get evaluations" }],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error.");
  }
});

// @route   GET api/evaluation/certificate/:certificate_id
// @desc    Get all evaluations for a certificate from Dynamics
// @access  Private, only used by CB, FSC, ASI
router.get(
  "/certificate/:certificate_id",
  auth,
  async (req: CustomRequest, res: Response) => {
    try {
      if (
        req.user &&
        req.user.role !== Role.CB &&
        req.user.role !== Role.ASI &&
        req.user.role !== Role.FSC
      ) {
        return res.status(401).json({
          errors: [
            {
              msg:
                "Only CB, FSC, or ASI can get evlaluations for a certificate",
            },
          ],
        });
      }

      const token = await getDynamicsAccessToken();
      if (!token) {
        return res.status(400).json({
          errors: [{ msg: "Failed to get access token from MS Dynamics" }],
        });
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const URL = dynamicsURL + "/fsc_evaluations";
      const response = await axios.get(URL, config);

      if (response.data.value) {
        return res.json(
          response.data.value.filter(
            (evaluation: any) =>
              evaluation._fsc_certificateid_value === req.params.certificate_id
          )
        );
      }

      return res.status(404).json({
        errors: [{ msg: "Failed to get evaluations for this certificate ID" }],
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
    }
  }
);

// @route   POST api/evaluation
// @desc    Add a new evaluation to Dynamics
// @access  Public
router.post("/", auth, async (req: CustomRequest, res: Response) => {
  try {
    if (req.user && req.user.role !== Role.CB) {
      return res.status(401).json({
        errors: [{ msg: "Only CB auditors can add a new evaluation" }],
      });
    }

    const token = await getDynamicsAccessToken();
    if (!token) {
      return res.status(400).json({
        errors: [{ msg: "Failed to get access token from MS Dynamics" }],
      });
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const body = {
      fsc_datefrom: req.body.date_from,
      fsc_dateto: req.body.date_to,
      "fsc_CertificateId@odata.bind": `/fsc_fsccertificates(${req.body.certificate_id})`,
      fsc_name: req.body.evaluation_name,
      fsc_comment: req.body.evaluation_comment,
      fsc_auditteamleader: req.body.auditor_name,
    };

    const URL = dynamicsURL + "/fsc_evaluations";
    const response = await axios.post(URL, body, config);

    if (response.data.error) {
      return res.status(404).json({
        errors: [{ msg: response.data.error }],
      });
    }

    return res.status(200).json({ msg: "Add evaluation success" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

export default router;
