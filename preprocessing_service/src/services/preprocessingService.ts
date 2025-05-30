import { STOPWORDS } from "../const/const";

export const preprocessText = (text: string): string[] => {
    return text
        .toLowerCase()
        .replace(/[^\wáéíóúüñ\s]/gi, "")
        .split(/\s+/)
        .filter(word => !STOPWORDS.has(word));
}
