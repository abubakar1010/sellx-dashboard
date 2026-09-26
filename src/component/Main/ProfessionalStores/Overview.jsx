import { useOutletContext } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { useUpdateStoreStatusMutation } from "../../../redux/features/Stores/Stores";

const contactIcon = (type) => {
  switch (type) {
    case "email": return <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />;
    case "phone":
    case "whatsapp": return <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />;
    default: return <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />;
  }
};

const Overview = () => {
  const { store, storeId } = useOutletContext();
  const [updateStoreStatus] = useUpdateStoreStatusMutation();

  const isBlocked = store?.status === "blocked";

  const handleToggleBlock = async () => {
    try {
      const newStatus = isBlocked ? "active" : "blocked";
      await updateStoreStatus({ id: storeId, status: newStatus }).unwrap();
      toast.success(`Store ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update store status");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Row 1: Store Information + Trust Metrics */}
      <div className="md:grid grid-cols-2 gap-4">
        {/* Store Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-2 md:mb-0">
          <h3 className="text-gray-900 font-semibold text-base mb-3">Store Information</h3>
          <p className="text-gray-400 text-xs mb-1">Description</p>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {store?.description || "No description available."}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs tracking-widest uppercase">Owner</span>
            <span className="text-gray-900 font-medium text-sm">{store?.owner?.fullName || "—"}</span>
          </div>
        </div>

        {/* Trust Metrics */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-900 font-semibold text-base mb-4">Trust Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-5 flex flex-col items-center justify-center">
              <p className="text-gray-900 font-bold text-2xl">
                {store?.avgRating?.toFixed(1) ?? "0.0"} <span className="text-green-700">&#9733;</span>
              </p>
              <p className="text-green-600 text-xs mt-1">{store?.totalReviewCount ?? 0} Reviews</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 flex flex-col items-center justify-center">
              <p className="text-gray-900 font-bold text-2xl">{store?.responseRate ?? 0}%</p>
              <p className="text-gray-400 text-xs mt-1">Response Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Contact Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-gray-900 font-semibold text-base mb-4">Contact Info</h3>
        <div className="space-y-3">
          {store?.contacts?.length > 0 ? (
            store.contacts.map((contact, idx) => (
              <div key={idx} className="flex items-center gap-3 text-gray-600 text-sm">
                {contactIcon(contact.type)}
                {contact.value}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No contact information available.</p>
          )}
        </div>
      </div>

      {/* Block/Unblock Store Button */}
      <div className="flex justify-end">
        <button
          onClick={handleToggleBlock}
          className={`text-sm font-medium px-5 py-2.5 rounded-xl transition-colors ${
            isBlocked
              ? "bg-green-50 text-green-600 hover:bg-green-100"
              : "bg-red-50 text-red-500 hover:bg-red-100"
          }`}
        >
          {isBlocked ? "Unblock store" : "Block store"}
        </button>
      </div>
    </div>
  );
};

export default Overview;
