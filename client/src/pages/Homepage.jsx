import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { User } from "lucide-react";
import ProfileModal from '../components/Profile'
import Message from "../components/Message";
import ChatBox from "../components/ChatBox";
import { useAuthStore } from "../store/useAuthStore";

function HomePage() {
  const [sideBar, setSideBar] = useState("chats");
  const [showProfile , setShowProfile] = useState(false)
const {authUser} = useAuthStore();
  return (
    <div className="flex h-[100vh]">
      {/* Sidebar */}
      <div className=" h-[100vh] w-[33%] bg-[#737373] text-white p-4 flex flex-col">
        <div className="flex items-center justify-between mx-2">
          <div className="text-3xl font-bold text-center">WhatsApp</div>
          <button onClick={()=>{
            setShowProfile(!showProfile)
          }}>
             <button  >
              <img className="w-10 h-10 rounded-full" src={authUser?.profilePic||"https://res.cloudinary.com/drzxyuyql/image/upload/v1735851581/wz017mi9kp2shfc9iczg.png" } alt="" />
             </button>
          </button>
          {showProfile ?<ProfileModal setShowProfile={setShowProfile}/> : <></>}

        </div>
        <div>
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full p-3 rounded-full bg-[#ffffff30] text-white placeholder-gray-300 focus:outline-none"
          />
        </div>
        {/* <div className="flex mt-4 mb-4">
          <button
            className="px-3 mx-[2px] rounded-full bg-[#ffffff30]"
            onClick={() => setSideBar("chats")}
          >
            chats
          </button>
          <button
            className="px-3 mx-[2px] rounded-full bg-[#ffffff30]"
            onClick={() => setSideBar("groups")}
          >
            groups
          </button>
          <button
            className="px-3 mx-[2px] rounded-full bg-[#ffffff30]"
            onClick={() => setSideBar("")}
          >
            chats
          </button>
        </div> */}
        <Sidebar sideBar={sideBar} />
      </div>
      </div>

      {/* Main Chat Section */}
      <ChatBox />
     
    </div>
  );
}

export default HomePage;
