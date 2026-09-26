import { useState } from "react";
import { FiClock } from "react-icons/fi";
import { Pagination } from "antd";
import StoriesStatus from "./StoriesStatus";
import PropTypes from "prop-types";
import { useGetStoryListQuery } from "../../../redux/features/storie/storie";
import { imageBaseUrl } from "../../../config/imageBaseUrl";

// ─── Helper ───────────────────────────────
const getStoryInfo = (expiresAt) => {
  if (!expiresAt) {
    return {
      isExpired: false,
      label: "NEW",
    };
  }

  const now = new Date();
  const exp = new Date(expiresAt);

  const diffMs = exp - now;

  if (diffMs <= 0) {
    return {
      isExpired: true,
      label: "EXPIRED",
    };
  }

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  let label = days > 0 ? `${days}d ${hours}h Left` : `${hours}h Left`;

  return {
    isExpired: false,
    label,
  };
};

// ─── StoryCard ───────────────────────────────
const StoryCard = ({ story }) => {
  const { isExpired, label } = getStoryInfo(story.expiresAt);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div className="relative h-52">
        <img
          src={
            story.media
              ? `${imageBaseUrl}${story.media}`
              : "https://via.placeholder.com/300"
          }
          crossOrigin="anonymous"
          alt={story.title || "story"}
          className="w-full h-64 object-cover"
        />

        {/* LEFT SIDE → NEW */}
        {!isExpired && (
          <span className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-full bg-green-500">
            NEW
          </span>
        )}

        {/* RIGHT SIDE → LABEL */}
        <span
          className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${
            isExpired
              ? "bg-[#F59E0B] text-white"
              : "bg-white bg-opacity-90 text-gray-700"
          }`}
        >
          {isExpired ? "EXPIRED" : (
            <>
              <FiClock size={11} />
              {label}
            </>
          )}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-2 mt-12">
        <div className="flex items-center gap-2">
          <img
            src={
              story.user?.avatarUrl
                ? `${imageBaseUrl}${story.user.avatarUrl}`
                : "https://via.placeholder.com/40"
            }
            crossOrigin="anonymous"
            alt={story.user?.firstName || "user"}
            className="w-6 h-6 rounded-full object-cover"
          />

          <span className="text-sm font-medium text-gray-800">
            {story.user?.firstName} {story.user?.lastName}
          </span>
        </div>

        <p className="text-sm font-bold text-gray-900 mt-0.5">
          {story.product?.title || "No product"}
        </p>
      </div>
    </div>
  );
};

// ─── PropTypes ───────────────────────────────
StoryCard.propTypes = {
  story: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    media: PropTypes.string,
    title: PropTypes.string,
    expiresAt: PropTypes.string,
    user: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      avatarUrl: PropTypes.string,
    }),
    product: PropTypes.shape({
      title: PropTypes.string,
    }),
  }).isRequired,
};

// ─── Stories ───────────────────────────────
const Stories = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data } = useGetStoryListQuery({
    page,
    limit: pageSize,
  });

  const items = data?.data?.items || [];
  const pagination = data?.data?.pagination;
  const total = pagination?.total || 0;

  return (
    <div>
      <StoriesStatus />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 py-5">
        {items.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <span className="text-sm text-gray-500">
          Showing {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, total)} of {total} stories
        </span>

        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default Stories;