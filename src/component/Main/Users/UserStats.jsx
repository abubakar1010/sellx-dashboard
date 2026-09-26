import { Users, ShieldCheck, Ban } from "lucide-react";
import { useGetAllStatsQuery } from "../../../redux/features/user/userApi";



const UserStats = () => {
  const {data} = useGetAllStatsQuery();
  const stats = [
  {
    label: "Total Users",
    value: data?.data?.totalUsers,
    change: "+12%",
    up: true,
    iconColor: "text-green-700",
    iconBg: "bg-green-50",
    icon: Users,
  },
  {
    label: "Verified Users",
    value: data?.data?.activeUsers,
    change: "+5.2%",
    up: true,
    iconColor: "text-teal-700",
    iconBg: "bg-teal-50",
    icon: ShieldCheck,
  },
  {
    label: "Blocked Accounts",
    value: data?.data?.blockedUsers,
    change: "-2.1%",
    up: false,
    iconColor: "text-red-700",
    iconBg: "bg-red-50",
    icon: Ban,
  },
];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-5 md:mt-7">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-5 flex flex-col gap-4 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center`}
              >
                <Icon size={18} className={s.iconColor} strokeWidth={2} />
              </div>
              <span
                className={`text-xs font-semibold flex items-center gap-0.5 ${
                  s.up ? "text-green-600" : "text-red-600"
                }`}
              >
                {s.up ? "▲" : "▼"} {s.change}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400">
                {s.label}
              </p>
              <p className="text-3xl font-medium text-gray-900 tracking-tight font-mono leading-none">
                {s.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserStats;