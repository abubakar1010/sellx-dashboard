import { TfiWallet } from "react-icons/tfi";
import { LuRocket } from "react-icons/lu";
import { PiBookOpenTextLight } from "react-icons/pi";
import { TrendingUp } from "lucide-react";
import { useGetPaymentStatsQuery } from "../../../redux/features/earnings/earningsApi";
import { formatPrice } from "../../../utils/currency";

const EarningsStatus = () => {
  const { data } = useGetPaymentStatsQuery();

  const statsData = data ?? {
    totalEarnings: 0,
    totalTransactions: 0,
    boost: { amount: 0, percentage: 0 },
    story: { amount: 0, percentage: 0 },
  };

  const stats = [
    {
      label: "Total earnings",
      value: formatPrice(statsData.totalEarnings),
      sub: `${statsData.totalTransactions} total transactions`,
      up: statsData.totalTransactions > 0,
      iconColor: "text-gray-500",
      iconBg: "bg-gray-100",
      icon: TfiWallet,
    },
    {
      label: "Boost revenue",
      value: formatPrice(statsData.boost.amount),
      sub: `${statsData.boost.percentage}% of total revenue`,
      up: statsData.boost.percentage > 0,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
      icon: LuRocket,
    },
    {
      label: "Story revenue",
      value: formatPrice(statsData.story.amount),
      sub: `${statsData.story.percentage}% of total revenue`,
      up: statsData.story.percentage > 0,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      icon: PiBookOpenTextLight,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6">
      {stats.map((s) => {
        const Icon = s.icon;

        return (
          <div
            key={s.label}
            className="bg-white rounded-xl p-5 flex flex-col gap-2.5 border border-gray-100 hover:border-gray-200 transition-colors duration-200"
          >
            {/* Top Row */}
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium tracking-widest uppercase text-gray-400">
                {s.label}
              </p>
              <div
                className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}
              >
                <Icon size={15} className={s.iconColor} />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Value */}
            <p className="text-[26px] font-medium text-gray-900 tracking-tight leading-none">
              {s.value}
            </p>

            {/* Sub text */}
            <div className="flex items-center gap-1.5">
              {s.up && (
                <TrendingUp size={12} className="text-green-500 flex-shrink-0" />
              )}
              <p
                className={`text-xs ${
                  s.up ? "text-green-500" : "text-gray-400"
                }`}
              >
                {s.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EarningsStatus;