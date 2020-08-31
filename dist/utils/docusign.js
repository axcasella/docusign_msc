"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAgreementCeremony = exports.signFinalCertificateCeremony = exports.getAccessToken = void 0;
// @ts-ignore types declaration
const docusign_esign_1 = __importDefault(require("docusign-esign"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const apiAccountID = "3872749a-589f-44f0-a92d-c737720624ac";
const fileName1 = "FSC_Certificate_Template_Hack.pdf";
const fileName2 = "FSC_TrademarlLicenseAgreement_Hackathon_20200.pdf";
const baseURL = "https://demo.docusign.net/restapi";
const BASE64_COMBINATION_OF_INTEGRATOR_AND_SECRET_KEYS = "MDhlY2I5MzMtMTNlMy00NWU3LWFlZDMtMDkwNDE4NDg4ZGI4Ojg1YmMzMzk1LTAzYWUtNGQzMS05OThlLWNiODg2Y2FmNzY0ZA==";
const tokenURL = "https://account-d.docusign.com/oauth/token";
const clientUserId = "signer123";
exports.getAccessToken = async (req, res) => {
    const code = req.header("code");
    if (!code) {
        return res.status(404).json({
            errors: [{ msg: "Missing code in request header" }],
        });
    }
    try {
        const body = {
            grant_type: "authorization_code",
            code: code,
        };
        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + BASE64_COMBINATION_OF_INTEGRATOR_AND_SECRET_KEYS,
            },
        };
        const response = (await axios_1.default.post(tokenURL, querystring_1.default.stringify(body), config));
        if (response.data) {
            return res.json({ data: response.data });
        }
        return res
            .status(401)
            .json({ msg: "Failed to get access token with provided code" });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
    }
};
exports.signFinalCertificateCeremony = async (req, res) => {
    const { signerEmail, signerName } = req.body;
    const bearerToken = req.header("authorization");
    if (!bearerToken) {
        return res
            .status(401)
            .json({ msg: "No bearer token found, authorization denied." });
    }
    if (!signerEmail) {
        return res.status(404).json({
            errors: [{ msg: "Missing signer email" }],
        });
    }
    if (!signerName) {
        return res.status(404).json({
            errors: [{ msg: "Missing signer name" }],
        });
    }
    try {
        const url = await getEmbeddedCeremony(bearerToken, signerEmail, signerName, fileName1);
        return res.json({ url: url });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Failed to get docusign embeded signing ceremony");
    }
};
exports.signAgreementCeremony = async (req, res) => {
    const { signerEmail, signerName } = req.body;
    const bearerToken = req.header("authorization");
    if (!bearerToken) {
        return res
            .status(401)
            .json({ msg: "No bearer token found, authorization denied." });
    }
    if (!signerEmail) {
        return res.status(404).json({
            errors: [{ msg: "Missing signer email" }],
        });
    }
    if (!signerName) {
        return res.status(404).json({
            errors: [{ msg: "Missing signer name" }],
        });
    }
    try {
        const url = await getEmbeddedCeremony(bearerToken, signerEmail, signerName, fileName2);
        return res.json({ url: url });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Failed to get docusign embeded signing ceremony");
    }
};
const getEmbeddedCeremony = async (bearerToken, signerEmail, signerName, filename) => {
    const authenticationMethod = "None";
    const envDef = new docusign_esign_1.default.EnvelopeDefinition();
    envDef.emailSubject =
        "Please sign this document sent for the Docusign Hackathon.";
    envDef.emailBlurb =
        "Please sign this document sent for the Docusign Hackathon.";
    const filePath = path_1.default.resolve(__dirname, "../files/" + filename);
    const pdfBytes = fs_1.default.readFileSync(filePath);
    const pdfBase64 = pdfBytes.toString("base64");
    // Create the document request object
    const doc = docusign_esign_1.default.Document.constructFromObject({
        documentBase64: pdfBase64,
        fileExtension: "pdf",
        name: fileName1,
        documentId: "1",
    });
    // Create a documents object array for the envelope definition and add the doc object
    envDef.documents = [doc];
    // Create the signer object with the previously provided name / email address
    const signer = docusign_esign_1.default.Signer.constructFromObject({
        name: signerName,
        email: signerEmail,
        routingOrder: "1",
        recipientId: "1",
        clientUserId: clientUserId,
    });
    // Create the signHere tab to be placed on the envelope
    let signHere;
    if (filename === fileName1) {
        signHere = docusign_esign_1.default.SignHere.constructFromObject({
            documentId: "1",
            pageNumber: "1",
            recipientId: clientUserId,
            tabLabel: "SignHereTab",
            xPosition: "195",
            yPosition: "487",
        });
    }
    else {
        signHere = docusign_esign_1.default.SignHere.constructFromObject({
            documentId: "1",
            pageNumber: "4",
            recipientId: clientUserId,
            tabLabel: "SignHereTab",
            xPosition: "295",
            yPosition: "327",
        });
    }
    // Create the overall tabs object for the signer and add the signHere tabs array
    signer.tabs = docusign_esign_1.default.Tabs.constructFromObject({ signHereTabs: [signHere] });
    // Add the recipients object to the envelope definition.
    envDef.recipients = docusign_esign_1.default.Recipients.constructFromObject({
        signers: [signer],
    });
    // Set the Envelope status
    envDef.status = "sent";
    const apiClient = new docusign_esign_1.default.ApiClient();
    apiClient.setBasePath(baseURL);
    apiClient.addDefaultHeader("Authorization", bearerToken);
    // Set the DocuSign SDK components to use the apiClient object
    docusign_esign_1.default.Configuration.default.setDefaultApiClient(apiClient);
    let envelopesApi = new docusign_esign_1.default.EnvelopesApi();
    let results;
    try {
        results = await envelopesApi.createEnvelope(apiAccountID, {
            envelopeDefinition: envDef,
        });
        const envelopeId = results.envelopeId;
        let recipientViewRequest = docusign_esign_1.default.RecipientViewRequest.constructFromObject({
            authenticationMethod: authenticationMethod,
            clientUserId: clientUserId,
            recipientId: "1",
            returnUrl: baseURL + "/dsreturn",
            userName: signerName,
            email: signerEmail,
        });
        results = await envelopesApi.createRecipientView(apiAccountID, envelopeId, {
            recipientViewRequest: recipientViewRequest,
        });
        return results.url;
    }
    catch (err) {
        return err;
    }
};
