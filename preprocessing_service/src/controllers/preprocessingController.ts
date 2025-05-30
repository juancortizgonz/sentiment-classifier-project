import type { Request, Response } from "express";
import { preprocessText } from "../services/preprocessingService";
import { textSchema } from "../validators/textValidator";

export const handlePreprocessing = (req: Request, res: Response) => {
    try {
        const parsed = textSchema.parse(req.body);
        const preprocessedText = preprocessText(parsed.text);
        res.status(200).json({ data: preprocessedText });
    } catch (_err: any) {
        res.status(400).json({ message: "Invalid Request" });
    }
}
