import express, { Application } from "express";
import enrollAdmin from "./chaincode_ops/enrollAdmin";
import certificateRouter from "./routes/api/certificate";

const app: Application = express();
app.use(express.json({ extended: false }));

app.use("/api/blockchain/certificates", certificateRouter);

enrollAdmin();

const PORT = process.env.PORT || 3333;
app.listen(PORT, () =>
  console.log(`Blockchain service started on port ${PORT}`)
);
