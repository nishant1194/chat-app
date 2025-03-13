import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import Url from "../utils/Url";
import { useChatStore } from "../store/useChatStore";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Message(props) {
  const ChatImage = ({ src, alt }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
      <div>
        {/* Chat Image Thumbnail */}
        <img
          src={src}
          alt={alt}
          className="object-cover cursor-pointer w-auto max-w-[30vw]"
          onClick={() => setIsModalOpen(true)}
        />

         {isModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center"
            onClick={() => setIsModalOpen(false)}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    );
  };

  const { authUser } = useAuthStore();
  const { selectedUser } = useChatStore();

  if (props?.from === authUser._id) {
    return (
      <div className="flex space-x-4 justify-end">
        <div className="bg-[#dcf8c6] p-3 rounded-xl max-w-[70%]">
          {props?.image && <ChatImage src={props?.image} alt="..." />}
          {props?.message &&  <ReactMarkdown>
          {props?.message}
          </ReactMarkdown>
             }
         </div>
      </div>
    );
  }
  return (
    <div className="flex space-x-4">
      <div className=" bg-white p-3 rounded-xl max-w-[70%]">
        {props?.image && (
          <button>
            <ChatImage src={props?.image} alt="..." />
          </button>
        )}
        <ReactMarkdown>{props?.message}</ReactMarkdown>
      </div>
    </div>
  );
}
