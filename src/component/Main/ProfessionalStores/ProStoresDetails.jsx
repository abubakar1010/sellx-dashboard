import { Outlet, NavLink, useParams } from "react-router-dom";
import { useGetSingleStoreQuery } from "../../../redux/features/Stores/Stores";
import { imageBaseUrl } from "../../../config/imageBaseUrl";

const ProStoresDetails = () => {
  const { id } = useParams();
  const { data: store, isLoading } = useGetSingleStoreQuery(id);

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 w-full mt-5">
        {/* Header */}
        {isLoading ? (
          <div className="animate-pulse flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 mb-2">
            {store?.logo ? (
              <img
                crossOrigin="anonymous"
                src={`${imageBaseUrl}${store.logo}`}
                alt={store.name}
                className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-[#0F3D2E] flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs leading-tight">
                  {store?.name?.slice(0, 4)?.toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-gray-900 font-semibold text-lg leading-tight">
                {store?.name || "—"}
              </h2>
              <p className="text-gray-400 text-sm">{store?.category?.title || "—"}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-gray-100 p-2">
            <p className="text-gray-400 text-xs mb-1">Total Listings</p>
            <p className="text-gray-900 font-semibold text-2xl">{store?.totalProducts ?? 0}</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-2">
            <p className="text-gray-400 text-xs mb-1">Revenue</p>
            <p className="text-gray-900 font-semibold text-2xl">${(store?.revenue ?? 0).toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-2">
            <p className="text-gray-400 text-xs mb-1">Followers</p>
            <p className="text-gray-900 font-semibold text-2xl">{store?.followerCount ?? 0}</p>
          </div>
        </div>
      </div>

      <br />

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-4">
        <NavLink to="" end className={({ isActive }) => isActive ? "text-[#0F3D2E] border-b-2 border-[#0F3D2E] pb-2" : "text-gray-500 pb-2"}>
          Overview
        </NavLink>
        <NavLink to="listing" className={({ isActive }) => isActive ? "text-[#0F3D2E] border-b-2 border-[#0F3D2E] pb-2" : "text-gray-500 pb-2"}>
          Listings
        </NavLink>
        <NavLink to="ads" className={({ isActive }) => isActive ? "text-[#0F3D2E] border-b-2 border-[#0F3D2E] pb-2" : "text-gray-500 pb-2"}>
          Ads
        </NavLink>
        <NavLink to="payments" className={({ isActive }) => isActive ? "text-[#0F3D2E] border-b-2 border-[#0F3D2E] pb-2" : "text-gray-500 pb-2"}>
          Payments
        </NavLink>
      </div>

      {/* Child Pages */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <Outlet context={{ store, storeId: id }} />
      </div>
    </section>
  );
};

export default ProStoresDetails;
