import { useGetStoresStatsQuery } from "../../../redux/features/Stores/Stores";

const StoresStatusCards = () => {
  const {data} = useGetStoresStatsQuery()
  const stats = [
          {
            label: "Total Stores",
            value: data?.totalStores,
            badge: "12%",
            badgeType: "percent",
            up: true,
          },
          {
            label: "Pending Approval",
            value: data?.pendingStores,
            badge: "Needs Review",
            badgeType: "text",
            valueColor: "text-yellow-500",
          },
          {
            label: "Monthly Revenue",
            value: data?.monthlyRevenue,
            badge: "8%",
            badgeType: "percent",
            up: true,
          },
        ];


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full mt-5 xl:mt-7">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-xl px-6 py-5 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <p className="text-xs text-gray-400 mb-3">{s.label}</p>
          <div className="flex items-center gap-2">
            <span className={`text-3xl font-bold tracking-tight ${s.valueColor || "text-gray-900"}`}>
              {s.value}
            </span>
            {s.badgeType === "percent" ? (
              <span className={`text-xs font-semibold ${s.up ? "text-green-500" : "text-red-500"}`}>
                ▲{s.badge}
              </span>
            ) : (
              <span className="text-xs text-gray-400">{s.badge}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoresStatusCards;