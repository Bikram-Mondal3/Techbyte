import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const runBtn = document.getElementById("run-btn");
  const chatHistory = document.getElementById("main-content");

  const genAI = new GoogleGenerativeAI(
    ""
  ); // Move this to backend
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  async function geminiResponse(userInput) {
    try {
      const result = await model.generateContent(userInput);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating content:", error);
      return "Sorry, I encountered an error processing your request.";
    }
  }

  function addMessageToHistory(message, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = isUser ? "user-message" : "ai-message";
    messageDiv.textContent = message;

    // Add animation for better interaction
    messageDiv.style.animation = "fadeIn 0.3s ease-in-out";

    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  // Event Listener: Send Message
  runBtn.addEventListener("click", async () => {
    // const userInput = chatBox.value.trim();
    const userInput = `Your name is Edubyte, developed by Edubyte team, powered by Google API and you are a friendly and helpful AI designed to provide instant assistance to me. Your primary goal is to ensure me feel supported and receive accurate, clear answers to my queries. You may also add some cool, interactive and appropriate emojis to your response. Always maintain a polite, engaging, and approachable tone, making interactions enjoyable and productive. Now don't repeat your name is Edubyte until I ask you to, just instantly answer only to my this response:${chatBox.value}`;
    if (userInput === "") return;

    addMessageToHistory(chatBox.value, true); // Add user input to the chat
    chatBox.value = ""; // Clear the chat input field

    const loadingDiv = document.createElement("div");
    loadingDiv.textContent = "Thinking...";
    loadingDiv.className = "loading-message";
    chatHistory.appendChild(loadingDiv);

    try {
      const response = await geminiResponse(userInput); // Fetch AI response
      chatHistory.removeChild(loadingDiv); // Remove loading text
      addMessageToHistory(response); // Add AI response to the chat
    } catch (error) {
      chatHistory.removeChild(loadingDiv);
      addMessageToHistory(
        "Error: Unable to process the request. Please try again."
      );
    }
  });

  chatBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      runBtn.click();
    }
  });
});
