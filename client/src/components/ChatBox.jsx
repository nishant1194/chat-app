import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import axios from "axios";
import Url from "../utils/Url";
import Message from "./Message";
import MessageInput from "./MessageInput";

export default function ChatBox() {
    const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
 
    const { authUser,socket } = useAuthStore();
    const { selectedUser } = useChatStore();
    const userId = selectedUser?._id;
  const [message, setMessages] = useState([]);
  const getMessages = async () => {
    try {
      const resp = await axios.get(Url + `/api/messages/${userId}/${authUser?._id}` ,{withCredentials:true});
      console.log(resp.data);
      setMessages(resp.data);
      console.log("resp");
    } catch (error) {
      console.log("Error in getting mesaages", error);
    }
  };

   
  useEffect(() => {
    getMessages();
     socket.on("newMessage", (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => socket.off("newMessage");

  }, [selectedUser?._id]);

  return (
    <>
   {selectedUser? <div className="flex-grow bg-[#e5ddd5] p-6 flex flex-col">
      <div className="text-2xl font-semibold mb-2">{selectedUser?.fullName}</div>
      <div className="h-1 bg-[#eae9e8] my-2" ></div>
      <div className="flex-grow overflow-y-auto space-y-4">
       {message && message?.map((msg)=>{
        return(
          <Message from={msg.senderId} message={msg.text} image={msg.image}/>
          )
       })}
       {message.length === 0 && <div className="w-full h-full  text-center p-4 flex justify-center items-center">
              <div>
                <h2 className="text-2xl font-bold">Getting Started</h2>
                <p className="text-lg mt-2">Type something to start chatting!</p>
              </div>
            </div>}
       </div>
      {/* <div className="flex items-center mt-4">
        <input
          type="text"
          placeholder="Type a message"
          className="w-full p-3 rounded-full bg-white border-2 border-gray-300 focus:outline-none"
        />
        <button className="ml-4 p-3 bg-[#25d366] rounded-full text-white" >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="text-white"
          >
            <path
              fill="currentColor"
              d="M4.76 4.5l1.41-1.41 14.34 14.34-1.41 1.41zM3 10v4h18v-4H3z"
            />
          </svg>
        </button>
      </div> */}
      <MessageInput message={message} setMessages={setMessages} />
    </div>:
              <div className="w-full h-full bg-blue-100 text-center p-4 flex justify-center items-center">
              <div>
                <h2 className="text-2xl font-bold">Getting Started</h2>
                <p className="text-lg mt-2">Type something to start chatting!</p>
              </div>
            </div>
  
  }
  </>
  );
}
