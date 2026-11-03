import { Pie, PieChart, Cell } from 'recharts';
import { useGetIncomeRatioQuery } from '../../../redux/features/dashboard/dashboardApi';

// ✅ Palette applied by index since API has no color field
const COLORS = ['#6366F1', '#34D399', '#FBBF24', '#C084FC', '#F87171', '#38BDF8'];

const Piechart = () => {
  const { data: apiData, isLoading } = useGetIncomeRatioQuery("monthly");

  // ✅ Correct nested path + map API shape to chart shape
  const chartData = (apiData?.data?.top_categories ?? []).map((item, i) => ({
    name: item.name,
    value: item.percentage,
    fill: COLORS[i % COLORS.length],
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-xs text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm p-2 w-full border border-gray-100">

        {/* Title */}
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Top Categories
        </h2>

        {/* Donut Chart */}
        <div className="flex justify-center mb-2">
          <PieChart width={200} height={200}>
            <Pie
              data={chartData}
              cx={100}
              cy={100}
              innerRadius={72}
              outerRadius={95}
              cornerRadius={8}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 px-4">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {item.value}%
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Piechart;