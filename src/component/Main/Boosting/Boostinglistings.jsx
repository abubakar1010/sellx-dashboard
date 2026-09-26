import { useState } from "react";
import { Table, ConfigProvider, Tag } from "antd";
import { useGetListingsQuery,  } from "../../../redux/features/listings/listingsApi";
import { formatPriceOrFree } from "../../../utils/currency";
// import { IoEyeSharp } from "react-icons/io5";
// import { MdOutlineInfo } from "react-icons/md";
// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Boostinglistings = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useGetListingsQuery({ page, limit: pageSize });
//   const [updateListingStatus] = useUpdateListingStatusMutation();

  const listings = data?.items ?? [];

//   const handleApprove = async (id) => {
//     await updateListingStatus({ id, status: "active" });
//   };

//   const handleReject = async (id) => {
//     await updateListingStatus({ id, status: "rejected" });
//   };

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

  const columns = [
    {
      title: "Image",
      render: (_, record) => (
        <img
          src={`${import.meta.env.VITE_API_URL}${record.thumbnail}`}
          alt={record.title}
          className="w-10 h-10 rounded-lg object-cover"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${record.id}/50/50`; }}
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
            onError={(e) => { e.target.src = `https://picsum.photos/seed/${record.seller_name}/28/28`; }}
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
        <Tag color={getTagColor(record.status)}>{getTagLabel(record.status)}</Tag>
      ),
    },
    // {
    //   title: "Action",
    //   render: (_, record) => {
    //     const { status, id } = record;
    //     return (
    //       <div className="flex items-center gap-3 text-lg">
    //         {status === "active" && (
    //           <IoEyeSharp className="text-[#FF8133] cursor-pointer hover:scale-110 transition" title="View Details" />
    //         )}
    //         {status === "draft" && (
    //           <>
    //             <IoEyeSharp className="text-gray-400 cursor-pointer hover:scale-110 transition" title="View Details" />
    //             <FaCheckCircle onClick={() => handleApprove(id)} className="text-green-500 cursor-pointer hover:scale-110 transition" title="Approve" />
    //             <FaTimesCircle onClick={() => handleReject(id)} className="text-red-500 cursor-pointer hover:scale-110 transition" title="Reject" />
    //           </>
    //         )}
    //         {status === "rejected" && (
    //           <MdOutlineInfo className="text-blue-500 cursor-pointer hover:scale-110 transition" title="View Details" />
    //         )}
    //         {status === "sold" && (
    //           <>
    //             <IoEyeSharp className="text-[#0F3D2E] cursor-pointer hover:scale-110 transition" title="View Details" />
    //             <MdOutlineInfo className="text-purple-500 cursor-pointer hover:scale-110 transition" title="More Info" />
    //           </>
    //         )}
    //       </div>
    //     );
    //   },
    // },
  ];

  return (
    <div className="py-5">
      <div className="bg-white p-4 shadow rounded-xl">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Boosting Listings</h2>
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

export default Boostinglistings;