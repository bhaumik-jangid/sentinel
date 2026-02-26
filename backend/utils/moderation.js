const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const isToxic = async (text) => {
  const prompt = `Analyze the following text for toxicity, hate speech, harassment, or explicit content. 
  Respond with only one word: "TOXIC" if it contains harmful content, or "CLEAN" if it is safe.
  
  Text: "${text}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const validation = response.text().trim().toUpperCase();
    
    return validation.includes("TOXIC");
  } catch (error) {
    console.error("Moderation Error:", error);
    return false; // Fail open or closed depending on your preference
  }
};

module.exports = { isToxic };