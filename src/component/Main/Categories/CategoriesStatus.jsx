import { CheckCircle, LayoutGrid, Timer } from "lucide-react";
import { useGetCategoriesStatsQuery } from "../../../redux/features/categories/categories";



const CategoriesStatus = () => {
 
 const {data} = useGetCategoriesStatsQuery();
 console.log(data)

  const stats = [
  {
    label: "Active Categories",
    value: data?.total_categories,
    change: "12%",
    up: true,
    iconColor: "text-green-500",
    iconBg: "bg-green-50",
    icon: CheckCircle,
  },
  {
    label: "Total Listings",
    value: data?.total_listings,
    change: "8.4%",
    up: true,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    icon: LayoutGrid,
  },
  {
    label: "Pending Review",
    value: data?.pending_review,
    change: "2.1%",
    up: false,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    icon: Timer,
  },
];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-6 py-5 md:py-8">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-6  flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center`}>
                <Icon size={18} className={s.iconColor} strokeWidth={2} />
              </div>
              <span className={`text-xs font-semibold ${s.up ? "text-green-500" : "text-red-500"}`}>
                {s.up ? "▲" : "▼"} {s.change}
              </span>
            </div>
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400">
              {s.label}
            </p>
            <p className="text-3xl font-medium text-gray-900 tracking-tight font-mono leading-none">
              {s.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default CategoriesStatus;