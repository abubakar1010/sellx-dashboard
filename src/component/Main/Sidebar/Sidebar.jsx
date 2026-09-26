/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { FaCrown } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "/logo/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/features/auth/authSlice";
import { useLogoutMutation } from "../../../redux/features/auth/authApi";
import { RiArchiveFill, RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaShapes, FaUserAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { GiOpenBook } from "react-icons/gi";
import { IoGift } from "react-icons/io5";
import { BiSolidOffer } from "react-icons/bi";
import { BsFillFileSpreadsheetFill, BsBoxSeam, BsBookHalf, BsCartCheck, BsJournalCheck, BsPersonCheck } from "react-icons/bs";
import { RiAdvertisementFill } from "react-icons/ri";

const sidebarItems = [
  { path: "/", name: "Dashboard", icon: <MdDashboard className="size-6" /> },
  { path: "/listings", name: "Listings", icon: <RiArchiveFill  className="size-6" /> },
  { path: "/categories", name: "Categories", icon: <FaShapes   className="size-6" /> },
  { path: "/users", name: "Users", icon: <FaUserAlt className="size-6" /> },
  { path: "/stories", name: "Stories", icon: <GiOpenBook className="size-6" /> },
  { path: "/professional-stores", name: "Pro Stores", icon: <IoGift className="size-6" /> },
  { path: "/subscriptions", name: "Subscriptions", icon: <FaCrown  className="size-6" /> },
  { path: "/coupon", name: "Coupon", icon: <BiSolidOffer  className="size-6" /> },
  { path: "/boosting", name: "Boosting", icon: <BsFillFileSpreadsheetFill   className="size-6" /> },
  { path: "/advertisement", name: "Advertisement", icon: <RiAdvertisementFill className="size-6" /> },
  { path: "/listing-packages", name: "Listing Pkgs", icon: <BsBoxSeam className="size-6" /> },
  { path: "/story-packages", name: "Story Pkgs", icon: <BsBookHalf className="size-6" /> },
  { path: "/listing-purchases", name: "Listing Sales", icon: <BsCartCheck className="size-6" /> },
  { path: "/story-purchases", name: "Story Sales", icon: <BsJournalCheck className="size-6" /> },
  { path: "/user-subscriptions", name: "User Subs", icon: <BsPersonCheck className="size-6" /> },
  { path: "/Earnings", name: "Payments", icon: <RiMoneyDollarCircleFill className="size-6" /> },
  { path: "/settings", name: "Settings", icon: <IoSettingsSharp className="size-6" /> },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const refreshToken = useSelector((state) => state.auth.refreshToken);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    if (refreshToken) {
      try {
        await logout({ refreshToken });
      } catch {
        // Proceed with local logout even if server-side revocation fails
      }
    }
    dispatch(logoutUser());
    navigate("/auth");
  };

  return (
    <div>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-[220px] lg:w-[260px] xl:w-[280px] bg-[#FFFFFF] fixed h-screen shadow-xl">
        <div className="flex flex-col h-full justify-between min-h-0">
          <div className="flex flex-col min-h-0">
            <div className="flex flex-col items-center pb-4 text-[#6B7280] my-2 shrink-0">
              <img src={logo} alt="logo" className="w-[105px] h-[100px]" />
            </div>
            <ul className="flex flex-col gap-3 overflow-y-auto flex-1 min-h-0">
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-[80%] mx-auto px-5 py-3 flex items-center gap-3  rounded-md transition-all duration-300 ease-in-out hover:bg-[#E7F2EE] hover:text-[#0F3D2E] ${
                      isActive ? "bg-[#E7F2EE] text-[#0F3D2E]" : ""
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </ul>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-10 py-4 hover:text-[#0F3D2E] text-[#6B7280] mb-4 shrink-0"
          >
            <IoIosLogOut className="ml-2 size-8 bg-red-500 p-1 text-[#FFFFFF] rounded-md" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-[#FFFFFF] shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col justify-center items-center pt-5 gap-2 text-white">
          <img src={logo} alt="logo" className="h-20 mb-5" />
        </div>
        <ul className="flex flex-col gap-3">
          {sidebarItems.map((item) => (
            <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-[80%] mx-auto px-5 py-4 flex items-center gap-3  rounded-md transition-all duration-300 ease-in-out hover:bg-[#E7F2EE] hover:text-[#0F3D2E] ${
                      isActive ? "bg-[#E7F2EE] text-[#0F3D2E]" : ""
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
          ))}
        </ul>
        <button
          onClick={() => {
            setShowModal(true);
            toggleSidebar();
          }}
          className="flex items-center gap-2 px-10 py-4 text-white ml-6"
        >
          <IoIosLogOut className="size-8 bg-red-500 p-1 rounded-md text-white" />
          <span>Logout</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-between">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;