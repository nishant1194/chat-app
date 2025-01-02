import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import axios from "axios";
import Url from "../utils/Url";
import { useGroupStore } from "../store/useGroupStore";

export default function Sidebar(props) {
  const { onlineUsers, socket } = useAuthStore();
  const { selectedUser, setSelectedUser } = useChatStore();
  const { selectedGroup, setSelectedGroup } = useGroupStore();
  
   const [users, setUsers] = useState([]);
  const [group, setGroup] = useState([]);
  const getUsers = async () => {
    try {
      const res = await axios.get(Url + "/api/messages/users", {
        withCredentials: true,
      });
      console.log(res.data);
      setUsers(res.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const getGroups = async () => {
    try {
      const res = await axios.get(Url + "/api/messages/users", {
        withCredentials: true,
      });
      console.log(res.data);
      setUsers(res.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getUsers();
    console.log(onlineUsers);
   }, []);

  if (props?.sideBar === "chats") {
    return (
      <div className="mt-2 space-y-4 overflow-y-auto">
        {users &&
          users?.map((item) => {
            return (
              <div
                className={`flex items-center space-x-4 p-2 hover:bg-[#128C7E] rounded-lg cursor-pointer
                ${
                  selectedUser?._id === item._id
                    ? "bg-white-300 ring-1 ring-base-300 text-red-500"
                    : ""
                }
                `}
                onClick={() => {
                  setSelectedUser(item);
                  console.log(selectedUser);
                }}
              >
                <div className="relative">
                  <img
                    src={item?.profilePic}
                    alt="contact"
                    className="w-10 h-10 rounded-full"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                  ${
                    onlineUsers.includes(item._id)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                  ></div>
                </div>

                <div>
                  <h4 className="text-white text-lg">{item.fullName}</h4>
                  {onlineUsers.includes(item._id) ? (
                    <p className="text-sm text-gray-300">Online</p>
                  ) : (
                    <p className="text-sm text-gray-300">Offline</p>
                  )}
                </div>
              </div>
            );
          })}{" "}
      </div>
    );
  }
  if (props?.sideBar === "groups") {
    return (
      <div className="flex flex-col mt-2 space-y-4 overflow-y-auto">
        {users &&
          users?.map((item) => {
            return (
              <div className="flex items-center space-x-4 p-2 hover:bg-[#128C7E] rounded-lg cursor-pointer">
                <img
                  src="https://via.placeholder.com/40"
                  alt="contact"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="text-white text-lg">{item.fullName}</h4>
                  <p className="text-sm text-gray-300">Hey, how are you?</p>
                </div>
              </div>
            );
          })}
        <div className="flex items-center space-x-4 p-2 hover:bg-[#128C7E] rounded-lg cursor-pointer">
          <img
            src="https://via.placeholder.com/40"
            alt="contact"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="text-white text-lg">Brosdickk</h4>
            <p className="text-sm text-gray-300">Hey, how are you?</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-2 hover:bg-[#128C7E] rounded-lg cursor-pointer">
          <img
            src="https://via.placeholder.com/40"
            alt="contact"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="text-white text-lg">Dharba</h4>
            <p className="text-sm text-gray-300">Let's catch up later!</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-2 hover:bg-[#128C7E] rounded-lg cursor-pointer">
          <img
            src="https://via.placeholder.com/40"
            alt="contact"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="text-white text-lg">{props.sideBar}</h4>
            <p className="text-sm text-gray-300">Hey, how are you?</p>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>nothing to show</div>;
  }
}
