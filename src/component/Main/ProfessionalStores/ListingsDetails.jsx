import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, Phone, Calendar, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useGetSingleListingQuery, useUpdateListingStatusMutation, useDeleteListingMutation } from "../../../redux/features/listings/listingsApi";
import { imageBaseUrl } from "../../../config/imageBaseUrl";

const ListingsDetails = () => {
  const { id, listingId } = useParams();
  const navigate = useNavigate();
  const { data: listing, isLoading } = useGetSingleListingQuery(listingId);
  const [updateListingStatus] = useUpdateListingStatusMutation();
  const [deleteListing] = useDeleteListingMutation();
  const [selectedImage, setSelectedImage] = useState(0);

  const images = listing?.media?.length > 0
    ? listing.media.map((m) => `${imageBaseUrl}${m}`)
    : ["https://picsum.photos/600/400"];

  const handleApprove = async () => {
    try {
      await updateListingStatus({ id: listingId, status: "active" }).unwrap();
      toast.success("Listing approved");
      navigate(`/professional-stores/${id}/listing`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async () => {
    try {
      await updateListingStatus({ id: listingId, status: "rejected" }).unwrap();
      toast.success("Listing rejected");
      navigate(`/professional-stores/${id}/listing`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteListing(listingId).unwrap();
      toast.success("Listing deleted");
      navigate(`/professional-stores/${id}/listing`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-5">
        <div className="h-80 bg-gray-200 rounded-xl" />
        <div className="h-6 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-32 bg-gray-100 rounded" />
      </div>
    );
  }

  if (!listing) {
    return <p className="text-center py-10 text-gray-500">Listing not found.</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: Images */}
      <div className="lg:w-[60%]">
        <div className="rounded-2xl overflow-hidden mb-3">
          <img
            crossOrigin="anonymous"
            src={images[selectedImage]}
            alt={listing.title}
            className="w-full h-[400px] object-cover"
            onError={(e) => { e.target.src = "https://picsum.photos/600/400"; }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <img
              key={idx}
              crossOrigin="anonymous"
              src={img}
              alt={`thumb-${idx}`}
              className={`w-16 h-16 rounded-lg object-cover cursor-pointer border-2 ${selectedImage === idx ? "border-[#0F3D2E]" : "border-transparent"}`}
              onClick={() => setSelectedImage(idx)}
              onError={(e) => { e.target.src = "https://picsum.photos/64"; }}
            />
          ))}
        </div>
      </div>

      {/* Right: Details */}
      <div className="lg:w-[40%] space-y-5">
        {/* Seller */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <img
              crossOrigin="anonymous"
              src={listing.seller?.avatarUrl ? `${imageBaseUrl}${listing.seller.avatarUrl}` : "https://picsum.photos/40"}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => { e.target.src = "https://picsum.photos/40"; }}
            />
            <div>
              <p className="font-semibold text-gray-900 text-sm">{listing.seller?.firstName} {listing.seller?.lastName}</p>
              <p className="text-xs text-gray-400">{listing.store?.name || "—"}</p>
            </div>
          </div>
          <div className="space-y-1.5 text-xs text-gray-500">
            {listing.seller?.email && <div className="flex items-center gap-2"><Mail size={12} /> {listing.seller.email}</div>}
            {listing.seller?.phone && <div className="flex items-center gap-2"><Phone size={12} /> {listing.seller.phone}</div>}
            <div className="flex items-center gap-2"><ShieldCheck size={12} /> Trust Score: {listing.store?.avgRating?.toFixed(1) || "N/A"}</div>
          </div>
        </div>

        {/* Listing Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{listing.title}</h2>
          <p className="text-2xl font-bold text-[#0F3D2E] mb-3">{listing.currency || "$"} {listing.price?.toLocaleString()}</p>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-400">Category</div>
            <div className="text-gray-900 font-medium">{listing.category?.title || listing.category_name || "—"}</div>
            <div className="text-gray-400">Condition</div>
            <div className="text-gray-900 font-medium capitalize">{listing.condition || "—"}</div>
            <div className="text-gray-400">Status</div>
            <div className="text-gray-900 font-medium capitalize">{listing.status || "—"}</div>
            <div className="text-gray-400">Listed</div>
            <div className="flex items-center gap-1 text-gray-900 font-medium">
              <Calendar size={12} />
              {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : "—"}
            </div>
          </div>
        </div>

        {/* Description */}
        {listing.description && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {(listing.status === "draft" || listing.status === "pending") && (
            <>
              <button onClick={handleReject} className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition">
                Reject
              </button>
              <button onClick={handleApprove} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition" style={{ background: "#0F3D2E" }}>
                Approve Listing
              </button>
            </>
          )}
          <button onClick={handleDelete} className="py-2.5 px-4 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingsDetails;
