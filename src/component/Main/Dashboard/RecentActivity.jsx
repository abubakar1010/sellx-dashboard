/* eslint-disable react/no-unescaped-entities */

import { useGetRecentActvitiesQuery } from "../../../redux/features/dashboard/dashboardApi";

import { imageBaseUrl } from "../../../config/imageBaseUrl";
import profile from "/logo/profile.jpg";

const RecentActivity = () => {
  const { data, isLoading, isError } = useGetRecentActvitiesQuery({
    page: 1,
    limit: 10,
  });

  const activities = data?.data?.items || [];



  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load activities</div>;
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-base font-bold text-gray-900">
          Recent Activity
        </div>
        <div className="text-sm text-indigo-500 cursor-pointer hover:text-indigo-700">
          View All
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100">
        {activities.slice(0, 8).map((item) => {


          const actorAvatar = item.actor?.avatar
            ? `${imageBaseUrl}${item.actor.avatar}`
            : profile;

          return (
            <div key={item.id} className="flex items-start gap-3 py-2.5">

              {/* Avatar */}
              <img
                src={actorAvatar}
                crossOrigin="anonymous"
                alt={item.actor?.name || "user"}
                className="w-8 h-8 rounded-full object-cover"
              />

              {/* Content */}
              <div className="text-sm text-gray-700 leading-relaxed">
                {/* actor name */}
                {item.actor?.name && (
                  <span className="font-semibold">
                    {item.actor.name}{" "}
                  </span>
                )}

                {/* title */}
                {item.metadata?.title && (
                  <span> {item.metadata.title}</span>
                )}

                <div>
                  {/* price */}
                  {item.metadata?.price && (
                    <span className="font-semibold mr-1">
                      (${item.metadata.price})
                    </span>
                  )}

                  {/* message */}
                  <span>
                {item.message?.length > 50
                 ? item.message.slice(0, 50) + "..."
                    : item.message}
                 </span>
                </div>

                {/* reason */}
                {item.metadata?.reason && (
                  <span> ({item.metadata.reason})</span>
                )}

                {/* time */}
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(item.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;