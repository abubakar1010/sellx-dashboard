import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useActiveStoriesQuery, useSingleUserQuery, useUserProductsQuery } from "../../../redux/features/user/userApi";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import { formatPrice } from "../../../utils/currency";

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ src, name }) => {
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return src ? (
    <img
      src={src}
      crossOrigin="anonymous"
      alt={name}
      className="w-16 h-16 rounded-xl object-cover shrink-0"
    />
  ) : (
    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-semibold shrink-0">
      {initials}
    </div>
  );
};

Avatar.propTypes = { src: PropTypes.string, name: PropTypes.string };
Avatar.defaultProps = { src: null, name: "" };

// ── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    active: "bg-green-100 text-green-700",
    blocked: "bg-red-100 text-red-600",
    pending: "bg-yellow-100 text-yellow-700",
  };
  const cls = map[(status || "").toLowerCase()] || "bg-gray-100 text-gray-500";
  return (
    <span className={`${cls} text-[9px] font-bold px-2 py-0.5 rounded-md tracking-widest uppercase`}>
      {(status || "unknown").toUpperCase()}
    </span>
  );
};

StatusBadge.propTypes = { status: PropTypes.string };
StatusBadge.defaultProps = { status: "" };

// ── Product Status Badge ──────────────────────────────────────────────────────
const ProductBadge = ({ status }) => {
  const map = {
    active:    "bg-green-100 text-green-700",
    sold:      "bg-green-100 text-green-700",
    published: "bg-blue-100 text-blue-700",
    pending:   "bg-yellow-100 text-yellow-700",
    blocked:   "bg-red-100 text-red-600",
    inactive:  "bg-red-100 text-red-500",
  };
  const cls = map[(status || "").toLowerCase()] || "bg-gray-100 text-gray-500";
  return (
    <span className={`${cls} text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide`}>
      {(status || "unknown").toUpperCase()}
    </span>
  );
};

ProductBadge.propTypes = { status: PropTypes.string };
ProductBadge.defaultProps = { status: "" };

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, badge, badgeClass }) => (
  <div className="bg-white rounded-2xl p-5 flex-1 flex flex-col gap-1 shadow-sm border border-gray-100 min-w-0">
    <div className="flex items-center justify-between">
      <span className="text-xl">{icon}</span>
      {badge && (
        <span className={`text-xs font-semibold ${badgeClass}`}>{badge}</span>
      )}
    </div>
    <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-2">
      {label}
    </p>
    <p className="text-4xl font-semibold text-gray-900">{value ?? 0}</p>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  badge: PropTypes.string,
  badgeClass: PropTypes.string,
};
StatCard.defaultProps = { value: 0, badge: null, badgeClass: "" };

// ── Info Row ──────────────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value || "—"}</p>
    </div>
  </div>
);

InfoRow.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};
InfoRow.defaultProps = { value: "" };

// ── Story Thumbnail Card ───────────────────────────────────────────────────────
const StoryThumb = ({ image, title, time, large }) =>
  large ? (
    <div className="relative rounded-xl overflow-hidden mb-3" style={{ aspectRatio: "16/7" }}>
      <img
        src={image}
        alt={title}
        crossOrigin="anonymous"
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 left-2">
        <span className="bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
          {time}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-white text-xs font-semibold">{title}</p>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-3 py-2.5 border-t border-gray-100 cursor-pointer hover:bg-gray-50 rounded-lg px-1 transition-colors">
      <img
        src={image || "https://placehold.co/38x38/6366f1/fff?text=S"}
        alt={title}
        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
      <span className="text-gray-300 text-lg">›</span>
    </div>
  );

StoryThumb.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  time: PropTypes.string,
  large: PropTypes.bool,
};
StoryThumb.defaultProps = { image: null, title: "", time: "", large: false };

// ── Main Component ────────────────────────────────────────────────────────────
const UsersDetailes = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useSingleUserQuery(id);
  const { data: product } = useUserProductsQuery(id);
  const {data:ActiveStories} = useActiveStoriesQuery({id, isActive:true})
  console.log(ActiveStories)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">
        Loading user details…
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-sm">
        Failed to load user data.
      </div>
    );
  }
  const user = data?.data ?? data;
  const { fullName,firstName,lastName,email,phone,avatarUrl,bio,status,createdAt,totalProducts,totalTransactions,avgRating,addresses,} = user;
  const avatarSrc = avatarUrl ? `${imageBaseUrl}${avatarUrl}` : null;
  const name = fullName || `${firstName ?? ""} ${lastName ?? ""}`.trim() || "Unknown";
  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "—";
  const location =  addresses && addresses.length > 0 ? `${addresses[0].city ?? ""}, ${addresses[0].country ?? ""}`.replace(
          /^, |, $/,
          ""
        )
      : "—";

  // product list — support both product.data and product.items
  const productList = product?.data ?? product?.items ?? [];

  return (
    <div className="min-h-screen bg-gray-50 p-5">

      {/* ── Top Row: Profile + Contact ── */}
      <div className="flex gap-4 mb-4">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl px-6 py-5 flex items-center gap-5 flex-1 shadow-sm border border-gray-100">
          <Avatar src={avatarSrc} name={name} />
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
              <StatusBadge status={status} />
            </div>
            <p className="text-sm text-gray-500">{email}</p>
            {bio && <p className="text-xs text-gray-400 mt-0.5">{bio}</p>}
            <p className="text-xs text-gray-400 mt-1">Member Since: {memberSince}</p>
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-white rounded-2xl px-6 py-5 min-w-[230px] shadow-sm border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-4">
            Contact Information
          </p>
          <div className="flex flex-col gap-4">
            <InfoRow icon="📞" label="Phone" value={phone} />
            <InfoRow icon="📍" label="Location" value={location} />
          </div>
        </div>
      </div>

      {/* ── Stat Cards Row ── */}
      <div className="flex gap-4 mb-4">
        <StatCard
          icon="🗂️"
          label="Total Listings"
          value={totalProducts}
          badge="+12%"
          badgeClass="text-green-500"
        />
        <StatCard
          icon="📖"
          label="Active Stories"
          value={avgRating > 0 ? Math.round(avgRating) : 0}
          badge="Active Now"
          badgeClass="text-indigo-500"
        />
        <StatCard
          icon="💳"
          label="Total Transactions"
          value={(totalTransactions ?? 0).toLocaleString()}
          badge="LxM"
          badgeClass="text-amber-500"
        />
      </div>

      {/* ── Bottom Row: Listing History + Active Stories ── */}
      <div className="flex gap-4 items-start">

        {/* ── Listing History ── */}
        <div className="w-full md:w-[70%] flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Listing History</h3>
            <button className="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors">
              VIEW ALL
            </button>
          </div>

          {productList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Item</th>
                    <th className="px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title</th>
                    <th className="px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                    <th className="px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {productList?.slice(0, 5).map((item) => {
                    return (
                      <tr
                        key={item?.id || item?._id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150"
                      >
                        {/* Image */}
                        <td className="px-3 py-3">
                          <img
                           crossOrigin="anonymous"
                            src={item.thumbnail ? `${imageBaseUrl}${item.thumbnail}` : "iamge"}
                            alt={item?.title}
                            className="w-11 h-11 rounded-lg object-cover"
                          />
                        </td>

                        {/* Title */}
                        <td className="px-3 py-3 font-semibold text-gray-800 max-w-[140px]">
                          <p className="truncate">{item?.title || "Untitled"}</p>
                        </td>

                        

                        {/* Price */}
                        <td className="px-3 py-3 font-bold text-indigo-600 whitespace-nowrap">
                          {formatPrice(item?.price)}
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <ProductBadge status={item?.status} />
                        </td>

                        {/* Date */}
                        <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap">
                            {new Date(item?.created_at).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                            </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-3">📦</div>
              <h4 className="text-base font-semibold text-gray-800">No Products Found</h4>
              <p className="text-xs text-gray-400 mt-1">
                This user has not added any products yet.
              </p>
            </div>
          )}
        </div>

        {/* ── Active Stories ── */}
        {/* Active Stories Panel */}
            <div className="w-full md:w-[33%] shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Active Stories</h3>
                <span className="bg-indigo-100 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase">
                ● LIVE
                </span>
            </div>

            {ActiveStories?.items?.length > 0 ? (
                <>
                {/* Featured story — index 0 */}
                <StoryThumb
                    image={ActiveStories.items[0].media ? `${imageBaseUrl}${ActiveStories.items[0].media}` : "no image"}
                    title={ActiveStories.items[0].title}
                    time={`${ActiveStories.items[0].viewCount} Views · ${ActiveStories.items[0].expireHoursLeft}h left`}
                    large
                />

                {/* Secondary stories — index 1+ */}
                {ActiveStories.items.slice(1).map((story) => (
                    <StoryThumb
                    key={story.id}
                    image={story.media}
                    title={story.title}
                    time={`${story.viewCount} Views · ${story.expireHoursLeft}h left`}
                    />
                ))}
                </>
            ) : (
                <p className="text-sm text-gray-400 text-center py-6">No active stories</p>
            )}
            </div>
      </div>
    </div>
  );
};

export default UsersDetailes;