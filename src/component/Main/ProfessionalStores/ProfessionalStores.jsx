import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FiFilter,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MdBlock } from "react-icons/md";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { BsImageAlt } from "react-icons/bs";
import StoresStatusCards from "./StoresStatusCards";
import { useGetStoresQuery } from "../../../redux/features/Stores/Stores";
import { imageBaseUrl } from "../../../config/imageBaseUrl";

const FILTER_TABS = [
  { label: "All Stores", value: "all" },
  { label: "Active Stores", value: "active" },
  { label: "Pending Stores", value: "pending" },
  { label: "Blocked Stores", value: "blocked" },
];

/* ---------------- STORE CARD ---------------- */
const StoreCard = ({ store }) => {
  const imageUrl = store.banner ? `${imageBaseUrl}${store.banner}` : null;
  const logoUrl = store.logo ? `${imageBaseUrl}${store.logo}` : null;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
    >
      <div className="relative h-[250px] w-full bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            crossOrigin="anonymous"
            alt={store.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <BsImageAlt size={36} className="text-gray-300" />
          </div>
        )}
      </div>

      <div className="px-4 -mt-5 relative z-10">
        <div className="w-11 h-11 rounded-xl bg-white shadow-md flex items-center justify-center border">
          {logoUrl ? (
            <img
              src={logoUrl}
              crossOrigin="anonymous"
              alt={store.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <HiOutlineBuildingStorefront size={20} className="text-gray-300" />
          )}
        </div>
      </div>

      <div className="px-4 pt-2 pb-4">
        <div className="flex justify-between">
          <div>
            <h3 className="text-[15px] font-bold">{store.name}</h3>
            <p className="text-[12px] text-gray-400">
              {typeof store.category === "object"
                ? store.category?.title
                : store.category ?? "Uncategorized"}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[15px] font-bold block">
              {store.totalProducts?.toLocaleString() ?? 0}
            </span>
            <span className="text-[9px] text-gray-400 uppercase">
              Listings
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Link
            to={`/professional-stores/${store.id}`}
            className="flex-1 bg-[#0F3D2E] text-white text-[13px] text-center rounded-lg py-2.5 hover:bg-[#0a2e22]"
          >
            {store.status === "pending" ? "Approve Store" : "View Store"}
          </Link>
          <button className="w-9 h-9 rounded-full border border-red-200 flex items-center justify-center text-red-400 hover:bg-red-50">
            <MdBlock size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

StoreCard.propTypes = {
  store: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    totalProducts: PropTypes.number,
    banner: PropTypes.string,
    logo: PropTypes.string,
    status: PropTypes.oneOf(["active", "pending", "blocked"]),
  }).isRequired,
};

/* ---------------- PAGINATION ---------------- */
const Pagination = ({ pagination, page, onPageChange }) => {
  const { totalPages } = pagination;

  const getPages = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (page <= 4) return [1, 2, 3, 4, 5, "...", totalPages];

    if (page >= totalPages - 3)
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div className="flex flex-col sm:flex-row items-center mt-8 pt-6 border-t border-gray-100">

      {/* RIGHT ALIGNED PAGINATION */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <FiChevronLeft size={15} />
        </button>

        {/* Pages */}
        {getPages().map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? "bg-[#0F3D2E] text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <FiChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  pagination: PropTypes.shape({
    total: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

/* ---------------- MAIN COMPONENT ---------------- */
const ProfessionalStores = () => {
  const [activeFilter, setActiveFilter] = useState(FILTER_TABS[0]);
  const [page, setPage] = useState(1);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data, isLoading, isError } = useGetStoresQuery({
    page,
    limit: 10,
    filter: activeFilter.value,
  });

  const stores = data?.items || [];
  const pagination = data?.data?.pagination ?? {
    total: 0,
    page: 1,
    totalPages: 1,
  };

  const handleFilterChange = (tab) => {
    setActiveFilter(tab);
    setPage(1);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <StoresStatusCards />

      {/* HEADER */}
      <div className="flex justify-end items-center mt-6 mb-5">
        <h2 className="text-lg font-bold">{activeFilter.label}</h2>

        {/* FILTER */}
        <div className="relative ml-4" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-2 border rounded-lg bg-white hover:bg-gray-50"
          >
            <FiFilter size={15} />
            <span className="text-sm">Filter</span>
            <FiChevronDown
              className={`transition ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-50">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleFilterChange(tab)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    activeFilter.value === tab.value
                      ? "bg-[#0F3D2E] text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* STATES */}
      {isLoading && (
        <p className="text-center text-gray-400 py-10">Loading stores…</p>
      )}
      {isError && (
        <p className="text-center text-red-400 py-10">
          Failed to load stores.
        </p>
      )}

      {/* GRID */}
      {!isLoading && !isError && (
        <>
          {stores.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {stores.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>

              <Pagination
                pagination={pagination}
                page={page}
                onPageChange={setPage}
              />
            </>
          ) : (
            <p className="text-center text-gray-400 py-10">
              No stores found.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ProfessionalStores;