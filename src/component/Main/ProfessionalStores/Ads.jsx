import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Table, ConfigProvider, Tag } from "antd";
import moment from "moment";
import { useGetStoreAdsQuery } from "../../../redux/features/Stores/Stores";

const Ads = () => {
  const { storeId } = useOutletContext();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isFetching } = useGetStoreAdsQuery({ id: storeId, page, limit });

  const dataSource = (data?.items ?? []).map((item) => ({
    key: item.id || item._id,
    ...item,
  }));

  const columns = [
    { title: "Ad Title", dataIndex: "adTitle", render: (t) => <span className="font-medium">{t}</span> },
    {
      title: "Type",
      dataIndex: "adType",
      render: (t) => <Tag color="blue">{t?.toUpperCase()}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (p) => <span className="font-semibold">${p}</span>,
    },
    { title: "Duration", dataIndex: "durationDays", render: (d) => `${d} days` },
    { title: "Start Date", dataIndex: "startDate", render: (v) => v ? moment(v).format("MMM DD, YYYY") : "—" },
    { title: "End Date", dataIndex: "endDate", render: (v) => v ? moment(v).format("MMM DD, YYYY") : "—" },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (active) => (
        <Tag color={active ? "green" : "default"}>{active ? "ACTIVE" : "INACTIVE"}</Tag>
      ),
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Ad Campaigns</h3>
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
            onChange: (p) => setPage(p),
          }}
        />
      </ConfigProvider>
    </div>
  );
};

export default Ads;
