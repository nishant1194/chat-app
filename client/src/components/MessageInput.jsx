import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Url from "../utils/Url";

const MessageInput = ({ message, setMessages,sideBar }) => {
  const [sending, setSending] = useState(false);
  const { authUser } = useAuthStore();
  const { selectedUser } = useChatStore();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text && !imagePreview) return; // Prevent sending empty messages
if(imagePreview){
  //  const toastId = toast.loading("Sending...");  // Show loading toast
 
}
  if(sideBar==='chats') {
    try {
       const resp = await axios.post(
         Url + `/api/messages/send/${selectedUser._id}`,
         {
           text: text,
           image: imagePreview,
           myId: authUser?._id,
         }
       );
       setMessages((prevMessages) => [...prevMessages, resp.data]);
       // Reset input fields after successful send
       setText("");
       setImagePreview(null);
       if (fileInputRef.current) fileInputRef.current.value = "";
       //  toast.success("Message sent", { id: toastId });  // Show success toast
     } catch (error) {
       console.error("Failed to send message:", error);
       toast.error("Failed to send message"); // Show error toast
     }
  }
  else if(sideBar==='groups'){
    try {
      const resp = await axios.post(
        Url + `/api/group/${selectedUser._id}/message`,
        {
          text: text,
          image: imagePreview,
          sender: authUser?._id,
        }
      );

      setText("");
      // Reset input fields after successful send
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessages((prevMessages) => [...prevMessages, resp.data]);
     
      //  toast.success("Message sent", { id: toastId });  // Show success toast
    } catch (error) {
      console.error("Failed to send message:", error);
      // toast.error("Failed to send message", { id: toastId }); // Show error toast
    }
  }
  };

  return (
    <div className="p-4 w-full ">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 items-center flex gap-2 ">
             <textarea
              type="text"
              className="w-full rounded-3xl px-4 pt-2"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
 
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
