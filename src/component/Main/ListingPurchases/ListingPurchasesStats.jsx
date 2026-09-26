import { FiShoppingBag, FiCheckCircle, FiAlertCircle, FiXCircle } from "react-icons/fi";
import { TfiWallet } from "react-icons/tfi";
import { LuListChecks } from "react-icons/lu";
import { useGetListingPurchaseStatsQuery } from "../../../redux/features/listingPurchases/listingPurchases";
import { formatPrice } from "../../../utils/currency";

const ListingPurchasesStats = () => {
  const { data } = useGetListingPurchaseStatsQuery();

  const stats = [
    { label: "Total Purchases", value: data?.totalPurchases ?? 0, icon: <FiShoppingBag size={20} />, bg: "bg-blue-50", color: "text-blue-600" },
    { label: "Active", value: data?.activePurchases ?? 0, icon: <FiCheckCircle size={20} />, bg: "bg-green-50", color: "text-green-600" },
    { label: "Exhausted", value: data?.exhaustedPurchases ?? 0, icon: <FiAlertCircle size={20} />, bg: "bg-yellow-50", color: "text-yellow-600" },
    { label: "Expired", value: data?.expiredPurchases ?? 0, icon: <FiXCircle size={20} />, bg: "bg-red-50", color: "text-red-500" },
    { label: "Total Revenue", value: formatPrice(data?.totalRevenue), icon: <TfiWallet size={20} />, bg: "bg-purple-50", color: "text-purple-600" },
    { label: "Listings Used", value: data?.totalListingsUsed ?? 0, icon: <LuListChecks size={20} />, bg: "bg-indigo-50", color: "text-indigo-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <div className={`${stat.bg} ${stat.color} p-1.5 rounded-lg`}>{stat.icon}</div>
          </div>
          <p className="text-[22px] font-bold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default ListingPurchasesStats;
