// src/component/Main/Listings/Details.jsx

import { useState } from "react";
import { Mail, Phone, Calendar, ShieldCheck, MapPin } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSingleListingQuery, useUpdateListingStatusMutation, useDeleteListingMutation } from "../../../redux/features/listings/listingsApi";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import { formatPriceOrFree } from "../../../utils/currency";



const getTagLabel = (status) => {
  switch (status) {
    case "active": return "ACTIVE";
    case "draft": return "PENDING REVIEW";
    case "sold": return "SOLD";
    case "rejected": return "REJECTED";
    default: return status?.toUpperCase();
  }
};

const getTagTextColor = (status) => {
  switch (status) {
    case "active": return "text-green-600";
    case "draft": return "text-orange-500";
    case "sold": return "text-blue-600";
    case "rejected": return "text-red-500";
    default: return "text-gray-500";
  }
};

const getTagDotColor = (status) => {
  switch (status) {
    case "active": return "bg-green-500";
    case "draft": return "bg-orange-500";
    case "sold": return "bg-blue-500";
    case "rejected": return "bg-red-500";
    default: return "bg-gray-400";
  }
};

/* -------------------------------
   SKELETON LOADER
--------------------------------*/
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const { data: listing, isLoading } = useGetSingleListingQuery(id);
  const [updateListingStatus, { isLoading: isUpdating }] = useUpdateListingStatusMutation();
  const [deleteListing, { isLoading: isDeleting }] = useDeleteListingMutation();

  /* -------------------------------
     MEDIA / IMAGES
  --------------------------------*/
  const images = listing?.media?.length
    ? listing.media.map((m) => `${imageBaseUrl}${m.url}`)
    : [`https://picsum.photos/seed/${id}/700/400`];

  /* -------------------------------
     HANDLERS
  --------------------------------*/
  const handleApprove = async () => {
    await updateListingStatus({ id, status: "active" });
  };

  const handleReject = async () => {
    await updateListingStatus({ id, status: "rejected" });
  };
  const handleDelete = async () => {
    await deleteListing(id);
    navigate("/listings");
  };


  /* -------------------------------
     SELLER INFO
  --------------------------------*/
  const seller = listing?.seller ?? {};
  const sellerName = seller.firstName
    ? `${seller.firstName} ${seller.lastName}`
    : "—";
  const sellerInitials = seller.firstName
    ? `${seller.firstName[0]}${seller.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";
  const rawAvatar = seller.avatarUrl || seller.avatar || seller.profileImage || seller.image || null;
  const sellerAvatar = rawAvatar ? `${imageBaseUrl}${rawAvatar}` : null;

  /* -------------------------------
     SPEC ROWS (dynamic based on listing fields)
  --------------------------------*/
  const specRows = [];
  if (listing?.type) specRows.push(["Type", listing.type, "Condition", listing.condition ?? "—"]);
  if (listing?.bedrooms != null) specRows.push(["Bedrooms", listing.bedrooms, "Total Rooms", listing.totalRooms]);
  if (listing?.usableArea) specRows.push(["Usable Area", `${listing.usableArea} m²`, "Internal Area", `${listing.internalArea} m²`]);
  if (listing?.yearBuilt) specRows.push(["Year Built", listing.yearBuilt, "Floor Level", listing.floorLevel]);
  if (listing?.balconyArea) specRows.push(["Balcony Area", `${listing.balconyArea} m²`, "Plot Size", `${listing.plotSize} m²`]);

  return (
    <section className="py-4 mt-2 md:mt-5">
      <div className="w-full md:flex justify-between">

        {/* LEFT: Image area */}
        <div className="flex flex-col gap-3 w-full md:w-[50%]">

          {/* Main image */}
          <div className="rounded-lg overflow-hidden bg-gray-800 h-[300px]">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-none" />
            ) : (
              <img
                src={images[active]}
                alt={listing?.title ?? "listing"}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${id}/700/400`; }}
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="w-[148px] h-[110px] shrink-0 rounded-lg" />
                ))
              : images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`w-[148px] h-[110px] rounded-lg overflow-hidden shrink-0 border-2 transition
                      ${i === active ? "border-gray-900 opacity-100" : "border-transparent opacity-70"}
                    `}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover block"
                      onError={(e) => { e.target.src = `https://picsum.photos/seed/${i}/148/110`; }}
                    />
                  </button>
                ))
            }
          </div>
        </div>

        {/* RIGHT: Seller panel */}
        <div className="w-full md:w-[30%] mt-5 md:mt-0">
          <div className="shadow rounded-md p-7 md:px-7">

            {/* Avatar + Name + Trust */}
            <div className="flex items-start gap-3 mb-6">

              {/* Avatar */}
              <div className="w-[46px] h-[46px] rounded-full bg-gray-200 border border-gray-300 overflow-hidden flex items-center justify-center shrink-0">
                {isLoading ? (
                  <Skeleton className="w-full h-full rounded-full" />
                ) : sellerAvatar ? (
                  <img
                    src={sellerAvatar}
                    alt={sellerName}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <span className="text-[11px] text-gray-600 font-semibold">{sellerInitials}</span>
                )}
              </div>

              {/* Name */}
              <div className="flex-1">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-28 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </>
                ) : (
                  <>
                    <div className="font-bold text-base text-gray-900 leading-tight">{sellerName}</div>
                    <div className="inline-flex items-center bg-blue-50 rounded px-2 py-[2px] mt-1">
                      <span className="text-[11px] font-semibold text-blue-600 tracking-wide">SELLER</span>
                    </div>
                  </>
                )}
              </div>

              {/* Rating */}
              <div className="text-right shrink-0">
                <div className="text-[11px] text-gray-400 mb-1">Rating</div>
                <div className="flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-4 h-4 text-green-500 stroke-[2.5]" />
                  {isLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    <span className="font-bold text-[17px] text-green-600">
                      {seller.avgRating ? `${seller.avgRating * 20}%` : "N/A"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact rows */}
            <div className="flex flex-col gap-5 mb-auto">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))
              ) : (
                <>
                  {seller.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500 stroke-[1.8]" />
                      <span className="text-sm text-gray-700">{seller.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500 stroke-[1.8]" />
                    <span className="text-sm text-gray-700">
                      {listing?.createdAt
                        ? `Listed on ${new Date(listing.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" })}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500 stroke-[1.8]" />
                    <span className="text-sm text-gray-700">
                      {seller.totalReviewCount ?? 0} review{seller.totalReviewCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-[11px] rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
              >
                Back
              </button>

              {/* draft: Approve + Reject side by side */}
              {listing?.status === "draft" && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={isUpdating}
                    className="flex-1 py-[11px] rounded-lg bg-[#1a3a2a] text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                  >
                    {isUpdating ? "Saving..." : "Approve"}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={isUpdating}
                    className="flex-1 py-[11px] rounded-lg bg-red-500 text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                  >
                    {isUpdating ? "Saving..." : "Reject"}
                  </button>
                </>
              )}

              {/* active: Reject button */}
              {listing?.status === "active" && (
                <button
                  onClick={handleReject}
                  disabled={isUpdating}
                  className="flex-1 py-[11px] rounded-lg bg-red-500 text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                >
                  {isUpdating ? "Rejecting..." : "Reject Listing"}
                </button>
              )}
            </div>

            {/* Delete Button */}
            <div className="mt-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full py-[11px] rounded-lg border border-red-400 text-red-500 text-sm font-semibold hover:bg-red-50 transition disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete Listing"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <br />

      {/* BOTTOM: Listing details */}
      <div className="w-full md:w-[50%] p-5 bg-white shadow rounded-lg text-gray-900 text-sm font-sans">

        {/* Header */}
        <div className="mb-2">
          {isLoading ? (
            <Skeleton className="h-4 w-24 mb-2 float-right" />
          ) : (
            <div className={`float-right flex items-center gap-1 ${getTagTextColor(listing?.status)} text-xs font-semibold tracking-wide`}>
              <span className={`w-2 h-2 rounded-full ${getTagDotColor(listing?.status)} inline-block`} />
              {getTagLabel(listing?.status)}
            </div>
          )}

          {isLoading ? (
            <>
              <Skeleton className="h-7 w-48 mb-2 clear-both" />
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-4 w-36" />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 clear-both">{listing?.title ?? "—"}</h2>
              <div className="text-xl font-bold text-blue-600 mb-1">
                {formatPriceOrFree(listing?.price)}
              </div>
              {listing?.location && (
                <div className="text-gray-500 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {[listing.location.address, listing.location.city, listing.location.country]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}
            </>
          )}
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-4 border-t border-b border-gray-200 py-3 my-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-3 w-14 mb-1" />
                <Skeleton className="h-4 w-10" />
              </div>
            ))
          ) : (
            [
              { label: "TRANSACTION", value: listing?.transactionType === "for_sell" ? "For Sale" : listing?.transactionType ?? "—", sub: "" },
              { label: "CONDITION", value: listing?.condition ? listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1) : "—", sub: listing?.hasDamage ? "Has Damage" : "" },
              { label: "FACILITIES", value: listing?.facilities?.length ? listing.facilities.length : "—", sub: listing?.facilities?.length ? "Available" : "" },
              { label: "LISTED", value: listing?.createdAt ? new Date(listing.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—", sub: "" },
            ].map(({ label, value, sub }) => (
              <div key={label}>
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</div>
                <div className="text-sm font-semibold text-gray-900">{value}</div>
                {sub && <div className="text-xs text-gray-500">{sub}</div>}
              </div>
            ))
          )}
        </div>

        {/* Description */}
        <div className="text-sm font-bold mb-2">Description</div>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ) : (
          <p className="text-xs text-gray-600 leading-relaxed">
            {listing?.description ?? "No description provided."}
          </p>
        )}

        {/* Facilities */}
        {!isLoading && listing?.facilities?.length > 0 && (
          <>
            <hr className="border-t border-gray-200 my-5" />
            <div className="text-sm font-bold mb-2">Facilities</div>
            <div className="flex flex-wrap gap-2">
              {listing.facilities.map((f) => (
                <span key={f} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{f}</span>
              ))}
            </div>
          </>
        )}

        {/* Specifications */}
        {!isLoading && specRows.length > 0 && (
          <>
            <hr className="border-t border-gray-200 my-5" />
            <div className="text-sm font-bold mb-2">Specifications</div>
            <div className="bg-[#F1F3F2] rounded-lg p-3">
              <table className="w-full border-collapse">
                <tbody>
                  {specRows.map((row, i) => (
                    <tr key={i} className="border-t border-b border-gray-200">
                      <td className="py-3 px-2 text-xs text-gray-400 w-[25%]">{row[0]}</td>
                      <td className="py-3 px-2 text-xs font-semibold text-gray-900 w-[25%]">{row[1]}</td>
                      <td className="py-3 px-2 text-xs text-gray-400 w-[25%]">{row[2]}</td>
                      <td className="py-3 px-2 text-xs font-semibold text-gray-900 w-[25%]">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Details;