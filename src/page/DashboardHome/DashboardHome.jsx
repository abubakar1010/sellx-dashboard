import IncomeGraphChart from "../../component/Main/Dashboard/IncomeGraphChart";
import Piechart from "../../component/Main/Dashboard/Piechart";
import RecentActivity from "../../component/Main/Dashboard/RecentActivity";
import RecentTransactions from "../../component/Main/Dashboard/RecentTransactions";
import Status from "../../component/Main/Dashboard/Status";
const DashboardHome = () => {
  return (
    <section>
      <div className="px-3">
        <Status />
    
        <div className="w-full h-full py-5  flex flex-col gap-4 md:flex-row justify-between items-center">
            {/* Left Column: Chart */}
            <div className="w-full lg:w-[60%] xl:w-[74%]  rounded-lg p-1">
              <IncomeGraphChart />
            </div>
            
            {/* Right Column: Pie Chart */}
            <div className="w-full lg:w-[38%] xl:w-[24%] ">
              <Piechart />
            </div>
          </div>


          <div className="w-full h-full xl:flex  justify-between xl:space-x-4 space-y-4 xl:space-y-0">
            {/* Right Column: Pie Chart */}
            <div className="w-full xl:w-[30%] ">
              <RecentActivity />
            </div>
          
            {/* Left Column: Chart */}
            <div className="w-full xl:w-[70%]  rounded-lg ">
              <RecentTransactions />
            </div>
            
          </div>
          <br /> <br />

      </div>
    </section>
  );
};

export default DashboardHome;
