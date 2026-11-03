import { useState } from "react";
import { Table, Modal, Input, Select } from "antd";
import { AiOutlineEye } from "react-icons/ai";
import { FiCheck, FiX } from "react-icons/fi";

import { useListRecentListingsQuery } from "../../../redux/features/dashboard/dashboardApi";
import { useUpdateListingStatusMutation } from "../../../redux/features/listings/listingsApi";
import { toast } from "sonner";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import profile from "/logo/profile.jpg";

const { Option } = Select;

const RecentListings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(8);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const [updateListingStatus] = useUpdateListingStatusMutation();

  const handleApprove = async (record) => {
    try {
      await updateListingStatus({ id: record.id, status: "active" }).unwrap();
      toast.success("Listing approved successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve listing");
    }
  };

  const handleReject = async (record) => {
    try {
      await updateListingStatus({ id: record.id, status: "rejected" }).unwrap();
      toast.success("Listing rejected successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject listing");
    }
  };

  // API
  const { data, isFetching } = useListRecentListingsQuery({
    page: currentPage,
    limit,
    status,
    search,
  });

  const dataSource = data?.data?.items || [];
  const meta = data?.data?.pagination;

  const img = (path) => (path ? `${imageBaseUrl}${path}` : profile);

  const statusBadge = (status) => {
    const map = {
      active: "text-green-600",
      pending: "text-yellow-600",
      draft: "text-yellow-600",
      rejected: "text-red-600",
      sold: "text-blue-600",
    };

    return (
      <span className={`font-semibold ${map[status?.toLowerCase()] || "text-gray-500"}`}>
        {status}
      </span>
    );
  };

  const handleView = (record) => {
    setSelected(record);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "title",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <img
          crossOrigin="anonymous"
            src={img(record.thumbnail)}
            className="w-9 h-9 rounded-md object-cover"
          />
          <span className="font-medium">{record.title}</span>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category_name",
    },
    {
      title: "Seller",
      dataIndex: "seller_name",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <img
          crossOrigin="anonymous"
            src={img(record.seller_avatar)}
            className="w-6 h-6 rounded-full object-cover"
          />
          {record.seller_name}
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => (
        <span className="font-semibold">${price}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => statusBadge(status),
    },
    {
      title: "Action",
      render: (_, record) => (
        <div className="flex gap-3 no-row-click text-lg">
          <FiCheck
            className="text-gray-400 hover:text-green-500 cursor-pointer"
            onClick={() => handleApprove(record)}
          />

          <FiX
            className="text-gray-400 hover:text-red-500 cursor-pointer"
            onClick={() => handleReject(record)}
          />

          <AiOutlineEye
            className="text-gray-400 hover:text-blue-500 cursor-pointer"
            onClick={() => handleView(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">

        <h2 className="text-lg font-bold">Recent Listings</h2>

        <div className="flex gap-3">

          {/* SEARCH */}
          <Input
            placeholder="Search listings..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: 200 }}
          />

          {/* FILTER */}
          <Select
            value={status}
            onChange={(value) => {
              setStatus(value);
              setCurrentPage(1);
            }}
            style={{ width: 150 }}
          >
            <Option value="all">All</Option>
            <Option value="pending">Pending</Option>
            <Option value="active">Active</Option>
            <Option value="rejected">Rejected</Option>
            <Option value="sold">Sold</Option>
          </Select>

        </div>
      </div>

      {/* TABLE */}
      <Table
        loading={isFetching}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={{
          current: currentPage,
          pageSize: limit,
          total: meta?.total || 0,
          showSizeChanger: false,
          onChange: (page) => setCurrentPage(page),
        }}

        onRow={(record) => ({
          onClick: (e) => {
            if (e.target.closest(".no-row-click")) return;
            handleView(record);
          },
        })}
      />

      {/* MODAL */}
      <Modal
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={null}
        title="Listing Details"
      >
        {selected && (
          <div className="space-y-2">
            <p><b>Title:</b> {selected.title}</p>
            <p><b>Category:</b> {selected.category_name}</p>
            <p><b>Seller:</b> {selected.seller_name}</p>
            <p><b>Price:</b> ${selected.price}</p>
            <p><b>Status:</b> {selected.status}</p>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default RecentListings;