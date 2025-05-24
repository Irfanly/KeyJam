import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });
const model = "gemini-2.0-flash";

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
    console.log("Analyzing audio file:", fileUrl, "with song key:", songKey);
    if (!fileUrl || !songKey) {
      throw new Error("File URL and song key are required for analysis.");
    }
    // Upload the audio file to Gemini
    const audioUpload = await ai.files.upload({
      file: fileUrl,
    });

    const prompt = 
      `You are a music theory assistant. A musician has provided an audio file of a song along with its musical key. The file is attached. 

      Your task is to:
      1. Analyze the audio to identify the chord progression throughout the song.
      2. Align the chords with the lyrics (if present).
      3. Format the output in a raw text style where chords appear on a line above the corresponding lyrics (similar to Ultimate Guitar style).
      4. Also provide a summary of the overall chord progression.

      Song Key: ${songKey}  

      Please begin the analysis. Make the output musician-friendly.`;

    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: createUserContent([
          createPartFromUri(audioUpload.uri, audioUpload.mimeType),
          prompt,
        ]),
      });

      console.log("Generated text:", response.text);
      return response.text;
    } catch (error) {
      console.error("Error analyzing audio:", error);
      throw error;
    }
  }

}

const gemini = new GeminiService();
export default gemini;