import { useState } from "react";
import { ConfigProvider, Table } from "antd";
import moment from "moment";
import { FiFilter } from "react-icons/fi";
import EarningsStatus from "./EarningsStatus";
import { useGetEarningsQuery } from "../../../redux/features/earnings/earningsApi";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import profile from "/logo/profile.jpg";
import { CURRENCY } from "../../../utils/currency";

const paymentTypeBadge = {
  boost: "bg-blue-50 text-blue-500",
  story: "bg-orange-50 text-orange-500",
  listing: "bg-green-50 text-green-600",
  subscription: "bg-purple-50 text-purple-600",
  ad: "bg-pink-50 text-pink-600",
};

const statusStyle = {
  approved: "text-green-600",
  pending: "text-amber-500",
  rejected: "text-red-500",
};

const Earnings = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [paymentType, setPaymentType] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetEarningsQuery({
    page,
    limit,
    ...(paymentType ? { paymentType } : {}),
    ...(status ? { status } : {}),
    ...(search ? { search } : {}),
  });

  const dataSource =
    data?.items?.map((item, index) => ({
      key: item?.id,
      si: index + 1,
      firstName: item?.user?.firstName || "",
      lastName: item?.user?.lastName || "",
      email: item?.user?.email || "",
      imageUrl: item?.user?.avatarUrl ? `${imageBaseUrl}${item?.user?.avatarUrl}` : profile ,
      paymentType: item?.paymentType,
      amount: item?.amount,
      currency: item?.currency || CURRENCY,
      description: item?.description,
      date: item?.date,
      status: item?.status,
    })) || [];

  const columns = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            crossOrigin="anonymous"
            src={record.imageUrl}
            alt="user"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold">
              {record.firstName} {record.lastName}
            </p>
            <p className="text-xs text-gray-400">{record.email}</p>
          </div>
        </div>
      ),
    },

    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <span>
          {text?.length > 40 ? text.slice(0, 40) + "..." : text}
        </span>
      ),
    },

    {
      title: "Payment Type",
      dataIndex: "paymentType",
      render: (val) => (
        <span className={`px-2 py-1 rounded ${paymentTypeBadge[val]}`}>
          {val}
        </span>
      ),
    },

    {
      title: "Amount",
      dataIndex: "amount",
      render: (val) => (
        <span className="font-semibold">${Number(val).toFixed(2)}</span>
      ),
    },

    {
      title: "Date",
      dataIndex: "date",
      render: (val) => moment(val).format("MMM DD, YYYY"),
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (val) => (
        <span className={statusStyle[val]}>{val}</span>
      ),
    },
  ];

  return (
    <section className="space-y-5">
      <EarningsStatus />

      <div className="bg-white rounded-2xl p-5 relative">
        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900">
              Recent Transactions
            </h2>
            <p className="text-xs text-gray-400">
              Real-time payment data
            </p>
          </div>

          {/* FILTER BUTTON */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 border px-3 py-2 rounded"
            >
              <FiFilter />
              Filter
            </button>

            {/* DROPDOWN (FIXED Z-INDEX) */}
            {dropdownOpen && (
              <div className="absolute right-0 top-12 bg-white shadow-lg border rounded-xl p-4 w-72 space-y-3 z-[9999]">
                
                {/* SEARCH */}
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />

                {/* PAYMENT TYPE */}
                <select
                  value={paymentType}
                  onChange={(e) => {
                    setPaymentType(e.target.value);
                    setPage(1);
                  }}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All Payment Types</option>
                  <option value="boost">Boost</option>
                  <option value="story">Story</option>
                  <option value="listing">Listing</option>
                  <option value="subscription">Subscription</option>
                  <option value="ad">Ad</option>
                </select>

                {/* STATUS */}
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                {/* RESET */}
                <button
                  onClick={() => {
                    setSearch("");
                    setPaymentType("");
                    setStatus("");
                    setPage(1);
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-sm font-medium py-2 rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TABLE */}
        <ConfigProvider>
          <Table
            loading={isLoading}
            dataSource={dataSource}
            columns={columns}
            rowKey="key"
            scroll={{ x: "max-content" }}
            pagination={{
              current: page,
              pageSize: limit,
              total: data?.pagination?.total || 0,
              onChange: (p, l) => {
                setPage(p);
                setLimit(l);
              },
            }}
          />
        </ConfigProvider>
      </div>
    </section>
  );
};

export default Earnings;