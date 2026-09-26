import { useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { Table, ConfigProvider, Tag } from "antd";
import { IoEyeSharp } from "react-icons/io5";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "sonner";
import { useGetStoreProductsQuery } from "../../../redux/features/Stores/Stores";
import { useUpdateListingStatusMutation } from "../../../redux/features/listings/listingsApi";
import { imageBaseUrl } from "../../../config/imageBaseUrl";

const filterToStatus = {
  All: "all",
  Pending: "draft",
  Active: "active",
  Rejected: "rejected",
  Sold: "sold",
  Expired: "expired",
};

const statusColors = {
  active: "green",
  draft: "orange",
  pending: "orange",
  rejected: "red",
  sold: "blue",
  expired: "default",
};

const ListingsPro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { storeId } = useOutletContext();
  const resolvedId = id || storeId;

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const pageSize = 10;

  const { data, isFetching } = useGetStoreProductsQuery({
    id: resolvedId,
    page,
    limit: pageSize,
    status: filterToStatus[filter],
  });

  const [updateListingStatus] = useUpdateListingStatusMutation();

  const handleApprove = async (record) => {
    try {
      await updateListingStatus({ id: record.id || record._id, status: "active" }).unwrap();
      toast.success("Listing approved");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async (record) => {
    try {
      await updateListingStatus({ id: record.id || record._id, status: "rejected" }).unwrap();
      toast.success("Listing rejected");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject");
    }
  };

  const dataSource = (data?.items ?? []).map((item) => ({
    key: item.id || item._id,
    ...item,
  }));

  const columns = [
    {
      title: "Image",
      dataIndex: "thumbnail",
      render: (thumbnail) => (
        <img
          crossOrigin="anonymous"
          src={thumbnail ? `${imageBaseUrl}${thumbnail}` : "https://picsum.photos/40"}
          onError={(e) => { e.target.src = "https://picsum.photos/40"; }}
          className="w-10 h-10 rounded-lg object-cover"
        />
      ),
    },
    { title: "Listing Title", dataIndex: "title", render: (t) => <span className="font-medium">{t}</span> },
    { title: "Category", dataIndex: "category_name" },
    {
      title: "Price",
      dataIndex: "price",
      render: (price, record) => <span className="font-semibold">{record.currency || "$"} {price}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color={statusColors[s] || "default"}>{s?.toUpperCase()}</Tag>,
    },
    {
      title: "Views",
      dataIndex: "viewCount",
      render: (v) => v ?? 0,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-3 text-lg">
          <IoEyeSharp
            className="text-gray-400 hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/professional-stores/${resolvedId}/listing/${record.id || record._id}`)}
          />
          {(record.status === "draft" || record.status === "pending") && (
            <>
              <FaCheckCircle className="text-gray-400 hover:text-green-500 cursor-pointer" onClick={() => handleApprove(record)} />
              <FaTimesCircle className="text-gray-400 hover:text-red-500 cursor-pointer" onClick={() => handleReject(record)} />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-1 mb-4 border-b">
        {Object.keys(filterToStatus).map((label) => (
          <button
            key={label}
            onClick={() => { setFilter(label); setPage(1); }}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              filter === label
                ? "border-b-2 border-[#0F3D2E] text-[#0F3D2E]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ConfigProvider theme={{ components: { Table: { headerBg: "#FFFFFF", headerColor: "#6B7280", borderRadiusLG: 10 } } }}>
        <Table
          loading={isFetching}
          columns={columns}
          dataSource={dataSource}
          rowKey="key"
          scroll={{ x: "max-content" }}
          pagination={{
            current: page,
            pageSize,
            total: data?.pagination?.total || 0,
            showSizeChanger: false,
            showQuickJumper: true,
            onChange: (p) => setPage(p),
          }}
        />
      </ConfigProvider>
    </div>
  );
};

export default ListingsPro;
