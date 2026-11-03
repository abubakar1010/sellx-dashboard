import { useState } from "react";
import { ConfigProvider,  Table } from "antd";
import { FiFilter, FiChevronDown, FiUserCheck } from "react-icons/fi";
import { FaStar, FaUserLock } from "react-icons/fa";
import UserStats from "./UserStats";
import { useGetAllUserQuery } from "../../../redux/features/user/userApi";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import profile from "/logo/profile.jpg";
import { useUpdateStatusMutation } from "../../../redux/features/user/userApi";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const FILTER_TABS = ["all", "active", "blocked"];

const Users = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // filter mapping
  const filter =
    activeFilter === "active"
      ? "active"
      : activeFilter === "blocked"
      ? "blocked"
      : undefined;

  // API
  const { data, isLoading, refetch } = useGetAllUserQuery({
    page,
    limit,
    filter,
  });



  const users = data?.data?.items || [];
  const pagination = data?.data?.pagination;

  const [updateStatus] = useUpdateStatusMutation();

  
  // toggle block/unblock
  const handleToggleBlock = async (record) => {
    const newStatus = record.status === "blocked" ? "active" : "blocked";

    try {
      const res = await updateStatus({ 
        id: record.id, 
        data: { status: newStatus },
      }).unwrap();

      if (res?.success) {
        toast.success("User status updated");
        refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // table data
  const dataSource = users.map((u, index) => ({
    ...u,
    key: u.id,
    si: index + 1,
    imageUrl: u.avatarUrl ? `${imageBaseUrl}${u.avatarUrl}` : profile,
  }));

  // table columns
  const columns = [
    {
      title: "User Profile",
      dataIndex: "firstName",
      key: "profile",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={
              record.imageUrl 
            }
            crossOrigin="anonymous"
            alt={record.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {record.firstName} {record.lastName}
            </p>
            <p className="text-xs text-gray-400">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Products",
      dataIndex: "totalProducts",
      key: "totalProducts",
      render: (val) => (
        <div>
          <p className="text-sm font-semibold">{val}</p>
          <p className="text-xs text-gray-400">Total Products</p>
        </div>
      ),
    },
    {
      title: "Rating",
      dataIndex: "avgRating",
      key: "avgRating",
      render: (val) => (
        <div className="flex items-center gap-1.5">
          <FaStar className="text-amber-400" size={14} />
          <span className="text-sm font-semibold">{val}</span>
        </div>
      ),
    },
    {
      title: "Details",
      key: "details",
      render: (_, record) => (
        <Link to={`/users/${record.key}`}
          className="px-3 py-1.5 border rounded-lg text-sm"
        >
          View
        </Link>
      ),
    },
    {
      title: "Action",
      key: "status",
      render: (_, record) => (
        <button onClick={() => handleToggleBlock(record)}>
          {record.status === "blocked" ? (
            <FaUserLock size={24} className="text-red-500" />
          ) : (
            <FiUserCheck size={24} className="text-green-500" />
          )}
        </button>
      ),
    },
  ];

  return (
    <section>
      <UserStats />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold ml-1">All Users</h2>

        {/* FILTER */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 border px-3 py-2 rounded-lg"
          >
            <FiFilter />
            {activeFilter}
            <FiChevronDown />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow z-50">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveFilter(tab);
                    setDropdownOpen(false);
                    setPage(1);
                  }}
                  className={`block w-full px-4 py-2 text-left ${
                    activeFilter === tab
                      ? "bg-gray-100 font-semibold"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#FFFFFF",
              headerColor: "#000000",
            },
          },
        }}
      >
        <Table
          loading={isLoading}
          dataSource={dataSource}
          columns={columns}
          pagination={{
            current: page,
            pageSize: limit,
            total: pagination?.total,
            onChange: (p) => setPage(p),
          }}
        />
      </ConfigProvider>

    </section>
  );
};

export default Users;