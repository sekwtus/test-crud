import { GoogleGenAI, Type } from "@google/genai";

// Ensure API key is present
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateEmployeeProfile = async (
  role: string,
  department: string,
  name: string
): Promise<{ bio: string; skills: string[] }> => {
  if (!role || !department) {
    throw new Error("Role and Department are required for AI generation.");
  }

  try {
    const prompt = `
      Generate a professional short biography (max 50 words) and a list of 5 key technical or soft skills 
      for a new employee named ${name || 'the employee'} who is starting as a ${role} in the ${department} department.
      
      Return the response in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bio: {
              type: Type.STRING,
              description: "A professional biography"
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of top 5 relevant skills"
            }
          }
        }
      }
    });

    const jsonStr = response.text || "{}";
    const data = JSON.parse(jsonStr);

    return {
      bio: data.bio || "Bio generation failed.",
      skills: data.skills || []
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails or key is missing
    return {
      bio: `Experienced ${role} joining the ${department} team.`,
      skills: ['Communication', 'Teamwork']
    };
  }
};