
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { DiseaseResult, CropSuggestion, SoilAnalysisInput } from "./types";

/**
 * Robustly extract JSON from a potentially markdown-formatted string
 */
function extractJSON(text: string): any {
  if (!text) throw new Error("AI returned an empty response");
  
  try {
    // Attempt 1: Direct parse
    return JSON.parse(text);
  } catch (e) {
    // Attempt 2: Extract text between triple backticks if present
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
    const match = text.match(jsonRegex);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1].trim());
      } catch (innerE) {
        console.error("Failed to parse extracted JSON content", match[1]);
      }
    }
    
    // Attempt 3: Find the first '{' and last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      const cleaned = text.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(cleaned);
      } catch (braceE) {
        console.error("Failed to parse braced content", cleaned);
      }
    }

    throw new Error("Could not parse AI response as JSON. Original response: " + text.substring(0, 100) + "...");
  }
}

/**
 * Helper to retry operations with exponential backoff for 429 errors
 */
async function retryWithBackoff<T>(operation: () => Promise<T>, retries = 3, initialDelay = 1000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    // Check for 429 (Too Many Requests) or 503 (Service Unavailable)
    const isRateLimit = error.message?.includes('429') || error.status === 429;
    const isServiceUnavailable = error.message?.includes('503') || error.status === 503;

    if (retries > 0 && (isRateLimit || isServiceUnavailable)) {
      const delay = initialDelay * 2 + Math.random() * 500; // Exponential backoff with jitter
      console.warn(`API Rate limit hit. Retrying in ${Math.round(delay)}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(operation, retries - 1, delay);
    }
    throw error;
  }
}

export async function detectCropDisease(imageBase64: string): Promise<DiseaseResult> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing from environment");
  
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Task: Diagnose the crop disease from the provided image.
    Rules:
    - Respond ONLY with a valid JSON object.
    - If the image is not a plant/crop, set "error" to "Not a plant".
    - Fields: cropName, diseaseName, severity (Low/Medium/High/Critical), explanation, chemicalRemedy (object with: products[], instructions, precautions), organicRemedy (object with: treatment, preparation, application).
  `;

  const imagePart = {
    inlineData: {
      mimeType: "image/jpeg",
      data: imageBase64,
    },
  };

  return retryWithBackoff(async () => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropName: { type: Type.STRING },
            diseaseName: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
            explanation: { type: Type.STRING },
            chemicalRemedy: {
              type: Type.OBJECT,
              properties: {
                products: { type: Type.ARRAY, items: { type: Type.STRING } },
                instructions: { type: Type.STRING },
                precautions: { type: Type.STRING },
              },
              required: ["products", "instructions", "precautions"]
            },
            organicRemedy: {
              type: Type.OBJECT,
              properties: {
                treatment: { type: Type.STRING },
                preparation: { type: Type.STRING },
                application: { type: Type.STRING },
              },
              required: ["treatment", "preparation", "application"]
            }
          },
          required: ["cropName", "diseaseName", "severity", "explanation", "chemicalRemedy", "organicRemedy"]
        },
      },
    });
    const result = extractJSON(response.text || "");
    return { ...result, timestamp: Date.now() };
  });
}

export async function getCropSuggestions(input: SoilAnalysisInput): Promise<CropSuggestion> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing from environment");

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Agricultural Soil Analysis:
    N: ${input.nitrogen}, P: ${input.phosphorus}, K: ${input.potassium}, pH: ${input.ph}, Soil: ${input.soilType}, Weather: ${input.weather}.
    Provide crop suggestions and soil improvement advice in JSON format.
  `;

  return retryWithBackoff(async () => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suitableCrops: { type: Type.ARRAY, items: { type: Type.STRING } },
            yieldPotential: { type: Type.STRING },
            fertilizerSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            reasoning: { type: Type.STRING }
          },
          required: ["suitableCrops", "yieldPotential", "fertilizerSuggestions", "warnings", "reasoning"]
        }
      },
    });

    return extractJSON(response.text || "");
  });
}

/**
 * Perform a search query using Google Search Grounding
 */
export async function searchAgriculturalKnowledge(query: string): Promise<{ text: string, sources: any[] }> {
  // Uses the specialized Expert Search API Key if available, otherwise falls back to the main key
  const apiKey = process.env.EXPERT_SEARCH_API_KEY || process.env.API_KEY;
  
  if (!apiKey) throw new Error("API Key (EXPERT_SEARCH_API_KEY or API_KEY) is missing from environment");

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.5-flash";

  return retryWithBackoff(async () => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: query }] },
      config: {
        // Important: Google Search tool enables the model to fetch real-time info
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a Senior Agronomist and Agricultural Scientist. Your goal is to provide precise, science-backed, and practical farming advice. Use the provided Google Search results to ground your answers in real-time data. If the user asks about crop prices, weather, or pest outbreaks, prioritize the most recent information found in the search tools. Always include the data source in your reasoning.",
      },
    });

    const text = response.text || "I found some information but couldn't synthesize a direct answer.";
    
    // Safely extract grounding chunks (citations)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return {
      text,
      sources: groundingChunks
    };
  });
}
