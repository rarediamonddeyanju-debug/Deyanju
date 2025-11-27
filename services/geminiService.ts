
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AppData } from "../types";

// Fallback video for demo purposes since AI generated URLs might be fake text
const DEMO_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";

const ResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    books: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          cover_image: { type: Type.STRING },
          summary: { type: Type.STRING },
          genre: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          review_count: { type: Type.NUMBER },
          author_id: { type: Type.STRING },
          trailer: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              video_url: { type: Type.STRING },
              thumbnail: { type: Type.STRING },
              duration: { type: Type.STRING },
              views: { type: Type.NUMBER },
              comments_count: { type: Type.NUMBER },
              upload_date: { type: Type.STRING },
            },
            required: ["id", "video_url", "thumbnail", "duration", "views", "comments_count", "upload_date"]
          },
        },
        required: ["id", "title", "cover_image", "summary", "genre", "rating", "review_count", "author_id", "trailer"]
      },
    },
    authors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          photo: { type: Type.STRING },
          bio: { type: Type.STRING },
          follower_count: { type: Type.NUMBER },
          total_trailer_views: { type: Type.NUMBER },
          books_written: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["id", "name", "photo", "bio", "follower_count", "total_trailer_views", "books_written"]
      },
    },
    comments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          trailer_id: { type: Type.STRING },
          username: { type: Type.STRING },
          timestamp: { type: Type.STRING },
          text: { type: Type.STRING },
          likes: { type: Type.NUMBER }
        },
        required: ["trailer_id", "username", "timestamp", "text", "likes"]
      },
    }
  },
  required: ["books", "authors", "comments"]
};

export const generateBookData = async (): Promise<AppData> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing. Please set process.env.API_KEY.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Generate a realistic dataset for a Book Community Platform.
      Create 5 unique, fictional books with diverse genres (Sci-Fi, Mystery, Fantasy, Romance, Thriller).
      Create 5 fictional authors corresponding to these books.
      Create 3-5 realistic comments for EACH book trailer.
      
      For 'cover_image' and 'photo', use 'https://picsum.photos/seed/{random_string}/400/600'.
      For 'thumbnail', use 'https://picsum.photos/seed/{random_string}/800/450'.
      For 'video_url', simply return the string '${DEMO_VIDEO_URL}' for all entries to ensure they are playable in this demo.
      
      Ensure ratings are between 3.5 and 5.0.
      Ensure 'review_count' (number of ratings) is between 45 and 1200.
      Ensure trailer view counts are strictly between 280,000 and 420,000.
      Ensure follower counts look realistic (e.g., 100 to 50,000).
      Ensure the 'trailer_id' in comments matches the 'id' of the corresponding book trailer.
      Ensure all comment timestamps are realistic dates strictly from the current year 2025 (e.g., "Feb 12, 2025", "2025-01-05"). Do not use dates from other years.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ResponseSchema,
        systemInstruction: "You are a creative content generator for a high-end book streaming platform. Write engaging summaries and bios."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as AppData;
    return data;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
