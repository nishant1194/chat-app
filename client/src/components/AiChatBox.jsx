import React, { useState } from "react";
import Message from "./Message";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

export default function AiChatBox() {
  const { authUser } = useAuthStore();
  const { aiMsg, setAiMsg } = useChatStore();
  const [message, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState();
  const [response, setResponse] = useState("");
  const genAI = new GoogleGenerativeAI(
    "AIzaSyDeGzP4YMJ-NjTcoxglTx4Ynv7Y5M_808E"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const getResponseForGivenPrompt = async (e) => {
    e.preventDefault();
     const toastId = toast.loading("Sending..."); // Show loading toast
    try {
      setAiMsg({ senderId: authUser?._id, text: inputValue });
      const result = await model.generateContent(
        "Please provide a response in paragraph format only. Do not include tables, charts. You can provide bullet points only if needed. The max limit of response is 220 words while the min limit is 10 words. Gererate response acc. to need. The input is : " +
          inputValue
      );
      const text = await result.response.text();
      setResponse(text);
      setAiMsg({ senderId: "aii", text: text });
      setInputValue("");
      toast.success("Sent", { id: toastId }); // Show success toast
    } catch (error) {
      toast.success("Error generating content", { id: toastId }); // Show success toast
      console.error("Error generating content:", error);
    }
  };

  return (
    <div className="w-3 flex-grow bg-[#e5ddd5] p-6 flex flex-col">
      <div className="text-2xl font-semibold mb-2">AI</div>
      <div className="h-1 bg-[#eae9e8] my-2"></div>
      <div className="flex-grow overflow-y-auto space-y-4">
        {aiMsg &&
          aiMsg?.map((msg) => {
            return (
              <Message
                from={msg.senderId}
                message={msg.text}
                image={msg.image}
              />
            );
          })}
        {aiMsg.length === 0 && (
          <div className="w-full h-full  text-center p-4 flex justify-center items-center">
            <div>
              <h2 className="text-2xl font-bold">Getting Started</h2>
              <p className="text-lg mt-2">Type something to start chatting!</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 w-full ">
        <form
          onSubmit={getResponseForGivenPrompt}
          className="flex items-center gap-2"
        >
          <div className="flex-1 items-center flex gap-2">
            <textarea
              type="text"
              className="w-full px-3 py-2 rounded-3xl focus:outline-none"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-sm btn-circle rounded-full p-3 bg-green-500"
            disabled={!inputValue}
          >
            <Send size={22} />
          </button>
        </form>
      </div>
    </div>
  );
}
