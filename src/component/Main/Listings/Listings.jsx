// src/component/Main/Listings/Listings.jsx
import ListingsStats from "./listingsStatas";
import { useState } from "react";
import { Table, ConfigProvider, Tag } from "antd";
import { IoEyeSharp } from "react-icons/io5";
import { MdOutlineInfo } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useGetListingsQuery,
  useUpdateListingStatusMutation,
  // useDeleteListingMutation,
} from "../../../redux/features/listings/listingsApi";
import { formatPriceOrFree } from "../../../utils/currency";

/* -------------------------------
   STATUS FILTER MAP
   API accepts: all | pending | active | rejected | sold | draft
--------------------------------*/
const filterToStatus = {
  All: "all",
  "Pending Review": "pending",
  "Active Listings": "active",
  Rejected: "rejected",
  "Recently Sold": "sold",
};

const Listings = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* -------------------------------
     BUILD QUERY PARAMS
  --------------------------------*/
  const queryParams = {
    page,
    limit: pageSize,
    status: filterToStatus[filter],
  };

  /* -------------------------------
     API CALLS
  --------------------------------*/
  const { data, isLoading } = useGetListingsQuery(queryParams);
  const [updateListingStatus] = useUpdateListingStatusMutation();
  // const [deleteListing] = useDeleteListingMutation();

  const listings = data?.items ?? [];
  const total = data?.pagination?.total ?? 0;

  /* -------------------------------
     HANDLERS
  --------------------------------*/
  const handleApprove = async (id) => {
    await updateListingStatus({ id, status: "active" });
  };

  const handleReject = async (id) => {
    await updateListingStatus({ id, status: "rejected" });
  };

  /* -------------------------------
     STATUS HELPERS
  --------------------------------*/
  const getTagColor = (status) => {
    switch (status) {
      case "active":   return "green";
      case "draft":    return "orange";
      case "sold":     return "blue";
      case "rejected": return "red";
      default:         return "default";
    }
  };

  const getTagLabel = (status) => {
    switch (status) {
      case "active":   return "Active";
      case "draft":    return "Pending";
      case "sold":     return "Sold";
      case "rejected": return "Rejected";
      default:         return status;
    }
  };

  /* -------------------------------
     TABLE COLUMNS
  --------------------------------*/
  const columns = [
    {
      title: "Image",
      render: (_, record) => (
        <img
          src={`${import.meta.env.VITE_API_URL}${record.thumbnail}`}
          alt={record.title}
          className="w-10 h-10 rounded-lg object-cover"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${record.id}/50/50`;
          }}
        />
      ),
    },
    {
      title: "Listing Title",
      render: (_, record) => (
        <span className="font-medium text-gray-800">{record.title}</span>
      ),
    },
    {
      title: "Category",
      render: (_, record) => <span>{record.category_name || "—"}</span>,
    },
    {
      title: "Seller",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <img
            src={`${import.meta.env.VITE_API_URL}${record.seller_avatar}`}
            alt={record.seller_name}
            className="w-7 h-7 rounded-full object-cover"
            onError={(e) => {
              e.target.src = `https://picsum.photos/seed/${record.seller_name}/28/28`;
            }}
          />
          <span>{record.seller_name}</span>
        </div>
      ),
    },
    {
      title: "Price",
      render: (_, record) => (
        <span className="font-semibold text-gray-800">
          {formatPriceOrFree(record.price)}
        </span>
      ),
    },
    {
      title: "Status",
      render: (_, record) => (
        <Tag color={getTagColor(record.status)}>
          {getTagLabel(record.status)}
        </Tag>
      ),
    },
    {
      title: "Action",
      render: (_, record) => {
        const { status, id } = record;

        return (
          <div className="flex items-center gap-3 text-lg">

            {/* Active — view details */}
            {status === "active" && (
              <IoEyeSharp
                onClick={() => navigate(`/listings/${id}`)}
                className="text-[#FF8133] cursor-pointer hover:scale-110 transition"
                title="View Details"
              />
            )}

            {/* Draft / Pending — view + approve + reject */}
            {status === "draft" && (
              <>
                <IoEyeSharp
                  onClick={() => navigate(`/listings/${id}`)}
                  className="text-gray-400 cursor-pointer hover:scale-110 transition"
                  title="View Details"
                />
                <FaCheckCircle
                  onClick={() => handleApprove(id)}
                  className="text-green-500 cursor-pointer hover:scale-110 transition"
                  title="Approve"
                />
                <FaTimesCircle
                  onClick={() => handleReject(id)}
                  className="text-red-500 cursor-pointer hover:scale-110 transition"
                  title="Reject"
                />
              </>
            )}

            {/* Rejected — view details */}
            {status === "rejected" && (
              <MdOutlineInfo
                onClick={() => navigate(`/listings/${id}`)}
                className="text-blue-500 cursor-pointer hover:scale-110 transition"
                title="View Details"
              />
            )}

            {/* Sold — view + info */}
            {status === "sold" && (
              <>
                <IoEyeSharp
                  onClick={() => navigate(`/listings/${id}`)}
                  className="text-[#0F3D2E] cursor-pointer hover:scale-110 transition"
                  title="View Details"
                />
                <MdOutlineInfo
                  onClick={() => navigate(`/listings/${id}`)}
                  className="text-purple-500 cursor-pointer hover:scale-110 transition"
                  title="More Info"
                />
              </>
            )}

          </div>
        );
      },
    },
  ];

  /* -------------------------------
     FILTER TABS
  --------------------------------*/
  const tabs = Object.keys(filterToStatus);

  return (
    <div>
      <ListingsStats />

      <div className="bg-white p-4 shadow rounded-xl">

        {/* FILTER TABS */}
        <div className="flex flex-wrap gap-4 mb-5">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => {
                setFilter(item);
                setPage(1);
              }}
              className={`px-2 py-1 text-sm md:text-base font-medium transition-all duration-200
                ${
                  filter === item
                    ? "border-b-2 border-[#0F3D2E] text-[#0F3D2E]"
                    : "text-gray-500"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#FFFFFF",
                headerColor: "#6B7280",
                borderRadiusLG: 10,
              },
            },
          }}
        >
          <Table
            dataSource={listings.map((item) => ({ ...item, key: item.id }))}
            columns={columns}
            loading={isLoading}
            pagination={{
              current: page,
              pageSize,
              total,
              position: ["bottomRight"],
              showQuickJumper: true,
              showSizeChanger: false,
              onChange: (p) => setPage(p),
            }}
            scroll={{ x: "max-content" }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Listings;