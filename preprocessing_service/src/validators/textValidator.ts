import { z } from "zod";

export const textSchema = z.object({
    text: z.string().max(280)
});
