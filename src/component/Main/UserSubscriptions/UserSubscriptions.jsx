import { useState } from "react";
import { Table, ConfigProvider, Tag } from "antd";
import moment from "moment";
import { toast } from "sonner";
import { FiFilter } from "react-icons/fi";
import UserSubscriptionsStats from "./UserSubscriptionsStats";
import {
  useGetUserSubscriptionsQuery,
  useCancelUserSubscriptionMutation,
} from "../../../redux/features/userSubscriptions/userSubscriptions";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import profile from "/logo/profile.jpg";

const statusColors = {
  active: "green",
  expired: "orange",
  cancelled: "red",
};

const UserSubscriptions = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data, isFetching } = useGetUserSubscriptionsQuery({ page, limit, status });
  const [cancelSubscription] = useCancelUserSubscriptionMutation();

  const handleCancel = async (id) => {
    try {
      await cancelSubscription(id).unwrap();
      toast.success("Subscription cancelled");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to cancel subscription");
    }
  };

  const dataSource = (data?.items ?? []).map((item) => ({
    key: item.id || item._id,
    ...item,
    userName: `${item.user?.firstName || ""} ${item.user?.lastName || ""}`.trim(),
    userEmail: item.user?.email || "",
    userAvatar: item.user?.avatarUrl ? `${imageBaseUrl}${item.user.avatarUrl}` : profile,
    storeName: item.store?.name || "—",
    planName: item.plan?.name || item.planSnapshot?.name || "—",
    billingType: item.plan?.billingType || item.planSnapshot?.billingType || "—",
    planPrice: item.plan?.price ?? item.planSnapshot?.price ?? 0,
  }));

  const columns = [
    {
      title: "User",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <img crossOrigin="anonymous" src={record.userAvatar} onError={(e) => { e.target.src = profile; }} className="w-8 h-8 rounded-full object-cover" />
          <div>
            <p className="font-medium text-sm text-gray-900">{record.userName}</p>
            <p className="text-xs text-gray-400">{record.userEmail}</p>
          </div>
        </div>
      ),
    },
    { title: "Store", dataIndex: "storeName" },
    { title: "Plan", dataIndex: "planName" },
    {
      title: "Billing",
      dataIndex: "billingType",
      render: (v) => <span className="capitalize">{v}</span>,
    },
    {
      title: "Price",
      dataIndex: "planPrice",
      render: (v) => <span className="font-semibold">${v}</span>,
    },
    {
      title: "Usage",
      render: (_, record) => (
        <span className="text-sm">
          {record.listingsUsed ?? 0} / {record.listingsRemaining === -1 ? "∞" : (record.listingsUsed ?? 0) + (record.listingsRemaining ?? 0)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color={statusColors[s] || "default"}>{s?.toUpperCase()}</Tag>,
    },
    { title: "Start", dataIndex: "startDate", render: (v) => v ? moment(v).format("MMM DD, YYYY") : "—" },
    { title: "End", dataIndex: "endDate", render: (v) => v ? moment(v).format("MMM DD, YYYY") : "—" },
    {
      title: "Auto Renew",
      dataIndex: "autoRenew",
      render: (v) => <span className={v ? "text-green-600" : "text-gray-400"}>{v ? "Yes" : "No"}</span>,
    },
    {
      title: "Action",
      render: (_, record) =>
        record.status === "active" ? (
          <button
            onClick={() => handleCancel(record.key)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Cancel
          </button>
        ) : (
          <span className="text-gray-300 text-sm">—</span>
        ),
    },
  ];

  return (
    <section className="py-7">
      <UserSubscriptionsStats />

      <div className="bg-white rounded-2xl p-5 mt-5 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">User Subscriptions</h2>
            <p className="text-sm text-gray-400">Monitor and manage active user subscriptions</p>
          </div>
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <FiFilter size={14} /> Filter
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-12 bg-white shadow-lg border rounded-xl p-4 w-60 space-y-3 z-[9999]">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button onClick={() => { setStatus(""); setPage(1); }} className="w-full text-sm text-gray-500 hover:text-gray-700">Reset</button>
              </div>
            )}
          </div>
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
              pageSize: limit,
              total: data?.pagination?.total || 0,
              showSizeChanger: false,
              showQuickJumper: true,
              onChange: (p) => setPage(p),
            }}
          />
        </ConfigProvider>
      </div>
    </section>
  );
};

export default UserSubscriptions;
