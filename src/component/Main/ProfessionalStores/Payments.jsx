import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Table, ConfigProvider, Tag } from "antd";
import moment from "moment";
import { useGetStorePaymentsQuery } from "../../../redux/features/Stores/Stores";

const typeColors = {
  promotion: "green",
  ad: "blue",
};

const Payments = () => {
  const { storeId } = useOutletContext();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isFetching } = useGetStorePaymentsQuery({ id: storeId, page, limit });

  const dataSource = (data?.items ?? []).map((item) => ({
    key: item.id || item._id,
    ...item,
  }));

  const columns = [
    { title: "Package Name", dataIndex: "packageName", render: (t) => <span className="font-medium">{t}</span> },
    {
      title: "Type",
      dataIndex: "type",
      render: (t) => <Tag color={typeColors[t] || "default"}>{t?.toUpperCase()}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (p) => <span className="font-semibold">${p}</span>,
    },
    { title: "Date", dataIndex: "date", render: (v) => v ? moment(v).format("MMM DD, YYYY") : "—" },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Payment History</h3>
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

export default Payments;
