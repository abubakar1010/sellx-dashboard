import { useState } from "react";
import { Table, ConfigProvider, Tag } from "antd";
import moment from "moment";
import { FiFilter } from "react-icons/fi";
import ListingPurchasesStats from "./ListingPurchasesStats";
import { useGetListingPurchasesQuery } from "../../../redux/features/listingPurchases/listingPurchases";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import profile from "/logo/profile.jpg";

const statusColors = {
  active: "green",
  exhausted: "orange",
  expired: "red",
};

const ListingPurchases = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data, isFetching } = useGetListingPurchasesQuery({ page, limit, status });

  const dataSource = (data?.items ?? []).map((item) => ({
    key: item.id || item._id,
    ...item,
    userName: `${item.user?.firstName || ""} ${item.user?.lastName || ""}`.trim(),
    userEmail: item.user?.email || "",
    userAvatar: item.user?.avatarUrl ? `${imageBaseUrl}${item.user.avatarUrl}` : profile,
    storeName: item.store?.name || "—",
    categoryName: item.category?.title || "—",
    packageName: item.packageSnapshot?.name || "—",
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
    { title: "Category", dataIndex: "categoryName" },
    { title: "Package", dataIndex: "packageName" },
    { title: "Used", dataIndex: "listingsUsed", render: (v) => <span className="font-medium">{v}</span> },
    { title: "Remaining", dataIndex: "listingsRemaining", render: (v) => <span className="font-medium">{v}</span> },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color={statusColors[s] || "default"}>{s?.toUpperCase()}</Tag>,
    },
    { title: "Purchased", dataIndex: "purchasedAt", render: (v) => v ? moment(v).format("MMM DD, YYYY") : "—" },
    { title: "Expires", dataIndex: "expiresAt", render: (v) => v ? moment(v).format("MMM DD, YYYY") : "—" },
  ];

  return (
    <section className="py-7">
      <ListingPurchasesStats />

      <div className="bg-white rounded-2xl p-5 mt-5 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Listing Purchases</h2>
            <p className="text-sm text-gray-400">All user listing package purchases</p>
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
                    <option value="exhausted">Exhausted</option>
                    <option value="expired">Expired</option>
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

export default ListingPurchases;
