import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey });

/**
 * Analyzes an uploaded image to suggest a title, tags, and potential shopping locations in Dar es Salaam context.
 */
export const analyzeItemImage = async (base64Image: string): Promise<AIAnalysisResult | null> => {
  if (!apiKey) {
    console.error("API Key is missing");
    return null;
  }

  try {
    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: "Wewe ni mtaalamu wa bidhaa na mitindo nchini Tanzania. Angalia picha hii na utambue ni kitu gani. Nipatie jina la bidhaa, kundi (mfano: Nguo, Vifaa vya Simu), tags 3 za kiswahili zinazohusiana, na maeneo mawili ambayo huenda ikapatikana Dar es Salaam (mfano: Kariakoo, Posta, Mlimani City). Jibu kwa JSON."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Short title of the item in Swahili" },
            category: { type: Type.STRING, description: "Category of the item" },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 relevant tags in Swahili"
            },
            suggestedLocations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 popular markets/areas in Dar es Salaam where this might be sold"
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    return null;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};