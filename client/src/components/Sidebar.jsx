import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import axios from "axios";
import Url from "../utils/Url";
import { useGroupStore } from "../store/useGroupStore";
import { X, Image } from "lucide-react";
import toast from "react-hot-toast";

export default function Sidebar(props) {
  const [creatingGrp, setCreatingGrp] = useState(false);
  const { onlineUsers, socket } = useAuthStore();
  const { selectedUser, setSelectedUser } = useChatStore();
  const { selectedGroup, setSelectedGroup } = useGroupStore();
  const [group, setGroup] = useState([]);
  const [grpName, setGrpName] = useState("");
  const [users, setUsers] = useState([]);
  const { authUser } = useAuthStore();
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
      const res = await axios.get(Url + `/api/group/${authUser?._id}`, {
        withCredentials: true,
      });
      console.log(res.data);
      setGroup(res.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const createGrp = () => {
    try {
      const resp = axios.post(Url + "/api/group", {
        name: grpName,
        admin: authUser._id,
        members: [authUser._id],
      });
      console.log(resp?.data);
      setGroup((prev) => [...prev, resp.data]);
    } catch (error) {
      console.log(error);
    }
  };
  // const filtered = data.filter((item) =>
  //   item.name.toLowerCase().includes(query.toLowerCase()) // Case-insensitive search
  // );
  // setUsers(filtered); // Update filtered data

  useEffect(() => {
    getUsers();
    getGroups();
    console.log(onlineUsers);
  }, []);

  if (props?.sideBar === "chats") {
    return (
      <div className="mt-2 flex flex-col space-y-4 h-[100%] overflow-y-auto">
        <div
          className={`flex items-center space-x-4 p-2 hover:bg-[#128C7E] rounded-lg cursor-pointer `}
          onClick={() => {
            setSelectedUser({ _id: "ai", fullName: "AI" });
            console.log(selectedUser);
          }}
        >
          <div className="relative">
            <img src="..." alt="contact" className="w-10 h-10 rounded-full" />
          </div>

          <div>
            <h4 className="text-white text-lg">{"AI"}</h4>
            <p className="text-sm text-gray-300">Always Online</p>
          </div>
        </div>
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
      <div className="mt-2 flex flex-col space-y-4 h-[100%] overflow-y-auto">
        <div className="flex items-center space-x-4 px-3 py-1 hover:bg-gray-500 rounded-lg cursor-pointer">
          <div className="w-10 h-10 text-3xl">+</div>
          <div>
            <h4
              className="text-white text-lg"
              onClick={() => {
                setCreatingGrp(true);
              }}
            >
              Create new Group
            </h4>
            {creatingGrp && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
                  {/* Close Button */}
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    onClick={() => {
                      setCreatingGrp(false);
                    }}
                  >
                    <X size={20} />
                  </button>

                  <div className="flex flex-col items-center space-y-4">
                    {/* User Info */}
                    <h2 className="text-xl font-semibold text-[#075e54]">
                      Create new Group
                    </h2>

                    <input
                      className="w-4/5 text-black bg-gray-200 h-[30px] p-4 rounded-xl"
                      placeholder="Enter group Name"
                      type="text"
                      value={grpName}
                      onChange={(e) => {
                        setGrpName(e.target.value);
                      }}
                    />

                    <button
                      className="mt-1 w-full bg-[#25d366] text-white py-2 rounded-full text-lg hover:bg-[#128C7E] transition"
                      onClick={createGrp}
                    >
                      Create Group
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {group &&
          group?.map((item) => {
            return (
              <div
                className=" flex items-center space-x-4 p-2 hover:bg-[#128C7E] rounded-lg cursor-pointer"
                onClick={() => {
                  setSelectedUser(item);
                  console.log(selectedUser);
                }}
              >
                <img
                  src="https://res.cloudinary.com/drzxyuyql/image/upload/v1735851581/wz017mi9kp2shfc9iczg.png"
                  alt="contact"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="text-white text-lg">{item?.name}</h4>
                  <p className="text-sm text-gray-300">Hey, how are you?</p>
                </div>
              </div>
            );
          })}
      </div>
    );
  } else {
    return <div>nothing to show</div>;
  }
}
