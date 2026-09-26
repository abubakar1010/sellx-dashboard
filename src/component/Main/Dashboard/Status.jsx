import PropTypes from "prop-types";
import { BsShop } from "react-icons/bs";
import { FaBolt, FaUsers, FaStore, FaClock } from "react-icons/fa";
import { MdOutlineMonetizationOn } from "react-icons/md";
import { useGetIncomeRatioQuery } from "../../../redux/features/dashboard/dashboardApi";
import { formatPrice } from "../../../utils/currency";

const StatCard = ({ icon: Icon, iconBg, iconColor, label, value, change, changeType }) => {
  const isNegative = changeType === "negative";
  return (
    <div className="flex flex-col justify-between mt-10 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBg, width: 44, height: 44 }}
        >
          <Icon style={{ color: iconColor, fontSize: 20 }} />
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded"
          style={{
            color: isNegative ? "#ef4444" : "#22c55e",
            backgroundColor: isNegative ? "#fef2f2" : "#f0fdf4",
          }}
        >
          {changeType === "absolute"
            ? `+${change}`
            : isNegative
            ? `-${change}%`
            : `+${change}%`}
        </span>
      </div>
      <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  iconBg: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  changeType: PropTypes.oneOf(["positive", "negative", "neutral", "absolute"]).isRequired,
};

const Status = () => {
  // ✅ Pass a valid timespan string, not the moment `months` import
  const { data } = useGetIncomeRatioQuery("yearly");

  // ✅ Destructure from the correct nested path
  const kpi = data?.data?.kpi_metrics;

  const formatUsers = (val) => {
    if (!val && val !== 0) return "—";
    return val >= 1000 ? (val / 1000).toFixed(1) + "k" : val.toString();
  };

  const stats = [
    {
      icon: BsShop,
      iconBg: "#EEF2FF",
      iconColor: "#6366f1",
      label: "Total Listings",
      value: kpi?.total_listings?.value?.toLocaleString() ?? "—",
      change: kpi?.total_listings?.change ?? 0,
      changeType: "positive",
    },
    {
      icon: FaBolt,
      iconBg: "#EFF6FF",
      iconColor: "#3b82f6",
      label: "Active Listings",
      value: kpi?.active_listings?.value?.toLocaleString() ?? "—",
      change: kpi?.active_listings?.change ?? 0,
      changeType: "positive",
    },
    {
      icon: FaUsers,
      iconBg: "#F0FDF4",
      iconColor: "#22c55e",
      label: "Total Users",
      value: formatUsers(kpi?.total_users?.value),
      change: kpi?.total_users?.change ?? 0,
      changeType: "positive",
    },
    {
      icon: FaStore,
      iconBg: "#FFF7ED",
      iconColor: "#f97316",
      label: "Prof. Stores",
      value: kpi?.total_stores?.value?.toLocaleString() ?? "—",
      change: kpi?.total_stores?.change ?? 0,
      changeType: "positive",
    },
    {
      icon: MdOutlineMonetizationOn,
      iconBg: "#F0FDF4",
      iconColor: "#16a34a",
      label: "Revenue",
      value: kpi ? formatPrice(kpi.revenue?.value) : "—",
      change: kpi?.revenue?.change ?? 0,
      changeType: kpi?.revenue?.change < 0 ? "negative" : "positive",
    },
    {
      icon: FaClock,
      iconBg: "#FFF1F2",
      iconColor: "#f43f5e",
      label: "Pending Appr.",
      value: kpi?.pending_approvals?.value?.toLocaleString() ?? "—",
      change: kpi?.pending_approvals?.change ?? 0,
      // ✅ Use change_type from API when available
      changeType: kpi?.pending_approvals?.change_type ?? "neutral",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((item, idx) => (
        <StatCard key={idx} {...item} />
      ))}
    </div>
  );
};

export default Status;