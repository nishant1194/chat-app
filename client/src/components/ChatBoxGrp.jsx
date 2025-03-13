import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import axios from "axios";
import Url from "../utils/Url";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function ChatBoxGrp({ sideBar }) {

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { authUser, socket } = useAuthStore();
  const { selectedUser } = useChatStore();
  const [addingMem, setAddingMem] = useState(false);
  const grpId = selectedUser?._id;
  const [grpName, setGrpName] = useState("Yesi am here");
  const [message, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [grpAdmin, setGrpAdmin] = useState("");
  const [grpMem, setGrpMem] = useState([]);
const [activity, setActivity]  = useState(0);
  const getUsers = async () => {
    try {
      const res = await axios.get(Url + "/api/messages/users", {
        withCredentials: true,
      });
      // console.log(res.data);
      setUsers(res.data);
      console.log(users);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const getMessages = async () => {
    try {
      const resp = await axios.get(Url + `/api/group/messages/${grpId}`, {
        withCredentials: true,
      });
      console.log(resp.data);
      setGrpAdmin(resp?.data[0].admin)
      setGrpName(resp?.data[0].name);
      setGrpMem(resp.data[0].members);
      setMessages(resp.data[0].messages);
      console.log("resp");
    } catch (error) {
      console.log("Error in getting mesaages", error);
    }
  };
  const removeMem = (id) => {
    if(grpAdmin!== authUser._id){
      toast.error("Only Admin can Remove member");
return
    }
    try {
      const resp = axios.put(Url + `/api/group/${grpId}/remove`, {
        memberId: id,
      });
      toast.success("Removed Successfully");

      setActivity(activity+1);

    } catch (error) {
      console.log(error);
    }
  };

  const addMem = (id) => {
    if(grpAdmin!== authUser._id){
      toast.error("Only Admin can Add member");
return
    }
    try {
      const resp = axios.put(Url + `/api/group/${grpId}/add`, { memberId: id });
      setActivity(activity+1);
      toast.success("Added Successfully");

    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMessages();
    getUsers();
  
    socket.on("groupMessage", (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });
  
    return () => {
      socket.off("groupMessage");
    };
  }, [selectedUser?._id, activity ]);
  
  const addMember = () => {
    setAddingMem(true);
  };
  return (
    <>
      {selectedUser ? (
        <div className="w-3 flex-grow bg-[#e5ddd5] p-6 flex flex-col">
          <div className=" mb-2 flex justify-between">
            <div className="text-2xl font-semibold">{grpName}</div>
            <button onClick={addMember}>X</button>
          </div>
          <div className="h-1 bg-[#eae9e8] my-2"></div>
          {addingMem && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
                <button
                  onClick={() => setAddingMem(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col items-center space-y-4 ">
                  {/* User Info */}
                  <h2 className="text-xl font-semibold text-[#075e54]">
                    Add users
                  </h2>
                  <div className="w-full h-[50vh] flex flex-col overflow-y-scroll">
                  {users &&
                    users?.map((item) => {
                      return (
                        <div className="w-full py-1 mt-1 bg-gray-200 rounded-xl" >
                          {item._id !== authUser._id ? (
                            <div className="w-full flex justify-between items-center px-5">
                               <div className="text-lg font-bold">
                                {item.fullName}
                              </div>
                              {grpMem.includes(item._id) && (
                                <button
                                  className="px-4 py-1 bg-red-600 text-white rounded-2xl"
                                  onClick={() => {
                                    removeMem(item._id);
                                  }}
                                >
                                  Remove
                                </button>
                              )}
                              {!grpMem.includes(item._id) && (
                                <button
                                  className="px-4 py-1 bg-green-600 text-white rounded-2xl"
                                  onClick={() => {
                                    addMem(item._id);
                                  }}
                                >
                                  Add
                                </button>
                              )}
                            </div>
                          ) : (
                            <div>jjj</div>
                          )}
                        </div>
                      );
                    })}
                    </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex-grow overflow-y-auto space-y-4">
            {message &&
              message?.map((msg) => {
                return (
                  <Message
                    from={msg.sender}
                    message={msg.text}
                    image={msg.image}
                  />
                );
              })}
            {message && message.length === 0 && (
              <div className="w-full h-full  text-center p-4 flex justify-center items-center">
                <div>
                  <h2 className="text-2xl font-bold">Getting Started</h2>
                  <p className="text-lg mt-2">
                    Type something to start chatting!
                  </p>
                </div>
              </div>
            )}
          </div>

          <MessageInput
            message={message}
            setMessages={setMessages}
            sideBar={sideBar}
          />
        </div>
      ) : (
        <div className="w-full h-full bg-blue-100 text-center p-4 flex justify-center items-center">
          <div>
            <h2 className="text-2xl font-bold">Getting Started</h2>
            <p className="text-lg mt-2">Type something to start chatting!</p>
          </div>
        </div>
      )}
    </>
  );
}
