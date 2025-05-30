import express from "express";
import cors from "cors";
import router from "./routes/preprocessingRoute";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/preprocess", router);

const PORT = process.env.PORT ?? 8001;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
