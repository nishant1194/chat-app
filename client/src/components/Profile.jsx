import React, { useState, useRef } from "react";
import { X, Image } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast"; // Assuming you are using react-hot-toast for error toasts
import axios from "axios";
import Url from "../utils/Url";

export default function ProfileModal({ setShowProfile }) {
  const { authUser, updateProfile } = useAuthStore(); // Assuming updateProfile exists in your store
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = async () => {
    if (imagePreview) {
      try {
        const resp = await axios.put(
          Url + "/api/auth/update-profile",
          { userId: authUser._id, profilePic: imagePreview },
          { withCredentials: true }
        );
        console.log(resp);
        updateProfile({ image: imagePreview });
        setImagePreview(null); // Optionally reset image preview
        toast.success("Profile updated!");
      } catch (error) {}
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => setShowProfile(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center space-y-4">
          {/* Profile Picture */}
          <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-[#25d366]">
            <img
              src={
                imagePreview ||
                authUser?.profilePic ||
                "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Edit Profile Picture */}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Image Preview button (optional) */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            Edit Profile Picture
          </button>

          {/* User Info */}
          <h2 className="text-xl font-semibold text-[#075e54]">
            {authUser.fullName}
          </h2>
          <p className="text-sm text-gray-500">{authUser.email}</p>
          <p className="text-sm text-gray-500">Active now</p>

          {/* Edit Profile Button */}
          <button
            onClick={handleProfileUpdate}
            className="mt-4 w-full bg-[#25d366] text-white py-2 rounded-full text-lg hover:bg-[#128C7E] transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
