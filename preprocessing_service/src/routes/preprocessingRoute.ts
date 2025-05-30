import { Router } from "express";
import { handlePreprocessing } from "../controllers/preprocessingController";

const router = Router();

router.post("/", handlePreprocessing);

export default router;
