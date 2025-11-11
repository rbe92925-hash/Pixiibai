import { GoogleGenAI, Chat, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

let chat: Chat | null = null;

// Function to initialize chat or get the existing instance
function getChatInstance(): Chat {
  if (!chat) {
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are a helpful assistant for "Pixibai", a photo printing service in Peru. Answer questions about photo albums, magnets, frames, and other products, as well as the creation process and delivery. Keep your answers friendly and concise.',
      },
    });
  }
  return chat;
}

export const getChatbotResponse = async (message: string): Promise<string> => {
  try {
    const chatInstance = getChatInstance();
    const response = await chatInstance.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return "Lo siento, tuve un problema para procesar tu solicitud. Inténtalo de nuevo.";
  }
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const editImageWithGemini = async (imageFile: File, prompt: string): Promise<string | null> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                imagePart,
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    return null;
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    return null;
  }
};