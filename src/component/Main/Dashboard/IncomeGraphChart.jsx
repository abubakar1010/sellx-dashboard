import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useGetIncomeRatioQuery } from "../../../redux/features/dashboard/dashboardApi";

const CHART_HEIGHT = 270;

const BarColumn = ({ revenue, bgRevenue, maxVal }) => {
  const bgH = Math.round((bgRevenue / maxVal) * CHART_HEIGHT);
  const fgH = revenue > 0 ? Math.round((revenue / maxVal) * CHART_HEIGHT) : 0;

  return (
    <div className="w-full h-full relative">
      {/* Light green bg bar (Listings) */}
      <div
        className="absolute bottom-0 left-0 right-0 rounded-md bg-emerald-50 transition-all duration-300"
        style={{ height: bgH }}
      />
      {/* Dark green fg bar (Revenue) */}
      {revenue > 0 && (
        <div
          className="absolute bottom-0 left-0 right-0 rounded-md transition-all duration-300"
          style={{ height: fgH, backgroundColor: "#1a3a2e" }}
        />
      )}
    </div>
  );
};

BarColumn.propTypes = {
  revenue: PropTypes.number.isRequired,
  bgRevenue: PropTypes.number.isRequired,
  maxVal: PropTypes.number.isRequired,
};

const PureComponentChart = () => {
  const [view, setView] = useState("month");

  // ✅ Hook at top level — timespan driven by toggle state
  const timespan = view === "month" ? "monthly" : "yearly";
  const { data: apiData, isLoading } = useGetIncomeRatioQuery(timespan);

  // ✅ Transform API shape → chart-friendly array
  const chartData = useMemo(() => {
    const analytics = apiData?.data?.growth_analytics;
    if (!analytics) return [];

    const labels = analytics.labels ?? [];
    const listingsDataset = analytics.datasets?.find((d) => d.label === "Listings");
    const revenueDataset  = analytics.datasets?.find((d) => d.label === "Revenue");

    return labels.map((name, i) => ({
      name,
      // bgRevenue = Listings count (background / taller bar)
      bgRevenue: listingsDataset?.data[i] ?? 0,
      // revenue = Revenue value (foreground / accent bar)
      revenue: revenueDataset?.data[i] ?? 0,
    }));
  }, [apiData]);

  // ✅ Guard: avoid division-by-zero when all values are 0
  const maxVal = useMemo(() => {
    const max = Math.max(...chartData.map((d) => d.bgRevenue), 1);
    return max * 1.1;
  }, [chartData]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 font-sans">

      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-0.5">
            Growth Analytics
          </p>
          <p className="text-xs text-gray-400">
            Listings and Revenue performance over time
          </p>
        </div>

        {/* Toggle */}
        <div className="flex border border-gray-200 rounded-full overflow-hidden">
          {["month", "year"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1 text-xs font-medium rounded-full border-none cursor-pointer transition-colors duration-200 ${
                view === v
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {v === "month" ? "Month" : "Year"}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center" style={{ height: CHART_HEIGHT }}>
          <p className="text-xs text-gray-400">Loading...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && chartData.length === 0 && (
        <div className="flex items-center justify-center" style={{ height: CHART_HEIGHT }}>
          <p className="text-xs text-gray-400">No data available</p>
        </div>
      )}

      {/* Bars */}
      {!isLoading && chartData.length > 0 && (
        <div
          className="flex items-end gap-1 md:gap-6 lg:gap-4 xl:gap-10 px-1"
          style={{ height: CHART_HEIGHT }}
        >
          {chartData.map((d) => (
            <div
              key={d.name}
              className="flex-1 flex flex-col items-center gap-2 h-full"
            >
              <div className="flex-1 w-full relative">
                <BarColumn
                  revenue={d.revenue}
                  bgRevenue={d.bgRevenue}
                  maxVal={maxVal}
                />
              </div>
              <span className="text-gray-400" style={{ fontSize: "8.5px" }}>
                {d.name}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default PureComponentChart;