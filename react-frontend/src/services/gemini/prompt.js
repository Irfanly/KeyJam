import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });
const model = "gemini-2.0-flash-lite";

class GeminiService {
  async generatePrompt(prompt) {
    try {
      const response = await model.generate(prompt);
      return response;
    } catch (error) {
      console.error("Error generating prompt:", error);
      throw error;
    }
  }
  //Analyze audio files
  async analyzeAudio(fileUrl, songKey) {
    const prompt = 
      `You are a music theory assistant. A musician has provided an audio file of a song along with its musical key. 

      Your task is to:
      1. Analyze the audio to identify the chord progression throughout the song.
      2. Align the chords with the lyrics (if present).
      3. Format the output in a raw text style where chords appear on a line above the corresponding lyrics (similar to Ultimate Guitar style).
      4. Also provide a summary of the overall chord progression.

      Song Key: ${songKey}  
      Audio File (URL): ${fileUrl}

      Please begin the analysis. Make the output musician-friendly.`;

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        prompt: prompt,
      });
      const { text } = response;
      console.log("Generated text:", text);
      // return text;
    } catch (error) {
      console.error("Error analyzing audio:", error);
      throw error;
    }
  }

}

const gemini = new GeminiService();
export default gemini;