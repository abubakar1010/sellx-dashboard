/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { RiNotification2Line } from "react-icons/ri";
import profile from "/logo/profile.jpg";
import { useGetUserQuery } from "../../../redux/features/profile/profileApi";
import { imageBaseUrl } from "../../../config/imageBaseUrl";

const Header = ({ toggleSidebar, title = "Dashboard" }) => {
  const { data } = useGetUserQuery();
  const user = data?.data;
  const userProfilePhoto = user?.avatarUrl ? `${imageBaseUrl}${user.avatarUrl}` : profile
  
  const navigate = useNavigate();
  return (
    <div className="w-full px-5 py-3.5 bg-white flex rounded-md shadow-md justify-between items-center sticky top-2 left-0 z-10">
      
      {/* Left: Title + mobile hamburger */}
      <div className="flex items-center gap-3">
        <button className="md:hidden text-3xl" onClick={toggleSidebar}>
          <FiMenu />
        </button>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>

      {/* Right: Notification + User info + Avatar */}
      <div className="flex items-center gap-5">
        {/* Notification bell */}
        <Link to="/notification">
          <div className="relative p-2 rounded-full bg-white">
            <RiNotification2Line className="size-7 text-gray-800" />
            <span className="absolute top-1 right-1 size-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="hidden md:block h-10 w-px bg-gray-200" />

        {/* Name & Role */}
        <div className="hidden md:flex flex-col leading-tight">
          <span className="text-sm font-semibold text-gray-900">
            {user?.firstName + " " + user?.lastName}
          </span>
          <span className="text-xs text-gray-400 tracking-wide uppercase">
            {user?.role }
          </span>
        </div>

        {/* Avatar */}
        <img
          onClick={() => navigate("/personal-info")}
          src={userProfilePhoto}
          alt="User avatar"
          crossOrigin="anonymous"
          className="size-11 rounded-full cursor-pointer border border-gray-300 object-cover shrink-0"
        />
      </div>
    </div>
  );
};

export default Header;