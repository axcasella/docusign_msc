import express, { Response } from "express";
import axios from "axios";
import { dynamicsURL } from "../config/config";
import { CustomRequest } from "../types/interface";
import { getDynamicsAccessToken, Role } from "../utils/utils";
import auth from "../middleware/auth";
import commentModel from "../models/comment";
import { enable_blockchain, blockchain_server_url } from "../config/config";

const router = express.Router();

// @route   GET api/certificate
// @desc    Get a list of certificates from Dynamics
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

    const URL = dynamicsURL + "/fsc_fsccertificates";
    const response = await axios.get(URL, config);

    if (response.data.value) {
      return res.json(response.data.value);
    }

    return res.status(404).json({
      errors: [{ msg: "Failed to get certificates" }],
    });
  } catch (err) {
    res.status(500).send("Server error.");
  }
});

// @route   POST api/certificate
// @desc    Add a new certificates to Dynamics
// @access  Public
router.post("/", auth, async (req: CustomRequest, res: Response) => {
  try {
    if (req.user && req.user.role !== Role.CB) {
      return res.status(401).json({
        errors: [{ msg: "Only CB auditors can add a new certificate" }],
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
      fsc_cwsourcecountries: "30,83",
      fsc_numberofsitesgroupmembers: req.body.number_of_group_members,
      fsc_certificatetype: 2,
      "fsc_CHOrganization@odata.bind": `/accounts(${req.body.ch_account_id})`,
      fsc_certificatenumber: req.body.cert_number,
      "fsc_CBOrganizationId@odata.bind": `/accounts(${req.body.cb_account_id})`,
      fsc_name: req.body.cert_name,
      fsc_controlledwoodcode: "W123",
    };

    const URL = dynamicsURL + "/fsc_fsccertificates";
    const response = await axios.post(URL, body, config);

    if (response.data.error) {
      return res.status(404).json({
        errors: [{ msg: response.data.error }],
      });
    }

    return res.status(200).json({ msg: "Add certification success" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// @route   POST api/certificate/:certificate_id/issue
// @desc    Update an existing certificate's status to "issued" in Dynamics
// @access  Private
router.post(
  "/:certificate_id/issue",
  auth,
  async (req: CustomRequest, res: Response) => {
    try {
      if (req.user && req.user.role !== Role.CB) {
        return res.status(401).json({
          errors: [
            {
              msg:
                "Only CB auditors can update a certificate's status to issued",
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

      let body = {
        fsc_certificatestatus: 2,
      };

      const URL =
        dynamicsURL + "/fsc_fsccertificates(" + req.params.certificate_id + ")";
      const response = await axios.patch(URL, body, config);

      if (response.data.error) {
        return res.status(404).json({
          errors: [{ msg: response.data.error }],
        });
      }

      // Add to blockchain ledger
      // A blockchain network must be started before this can be used
      if (enable_blockchain) {
        const bcURL = blockchain_server_url + "/api/blockchain/certificates";
        let bcReqBody = {
          certificateID: req.params.certificate_id,
          type: "Multisite certificate",
          company: req.body.ch_account_id,
          issuer: req.body.cb_account_id,
        };

        const response = await axios.post(bcURL, bcReqBody);

        if (response.data.error) {
          return res.status(404).json({
            errors: [{ msg: response.data.error }],
          });
        }
      }

      return res
        .status(200)
        .json({ msg: "Update certification status to issued success" });
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

// @route   POST api/certificate/:certificate_id/add_comment
// @desc    Add a comment to a certificate
// @access  Private; only used by auditor and CoC company
router.post(
  "/:certificate_id/add_comment",
  auth,
  async (req: CustomRequest, res: Response) => {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        errors: [{ msg: "Comment is empty" }],
      });
    }

    if (
      !req.user ||
      (req.user.role !== Role.CB && req.user.role !== Role.Applicant)
    ) {
      return res.status(401).json({
        errors: [{ msg: "Only CB or CoC applicant can add a comment" }],
      });
    }

    try {
      let newComment = new commentModel({
        comment,
        author: req.user.name,
        certificate: req.params.certificate_id,
      });

      // Save to DB
      const addedComment = await newComment.save();

      res.json({ msg: "Comment added successfully", comment: addedComment });
    } catch (err) {
      res.status(500).send("Server error.");
    }
  }
);

// @route   POST api/certificate/:certificate_id/comments
// @desc    Get all comments of a certificate
// @access  Private; only used by auditor and CoC company
router.get(
  "/:certificate_id/comments",
  auth,
  async (req: CustomRequest, res: Response) => {
    try {
      const comments = await commentModel
        .find({ certificate: req.params.certificate_id })
        .populate("comments");
      res.json(comments);
    } catch (err) {
      res.status(500).send("Server error.");
    }
  }
);

export default router;
