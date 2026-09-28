import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "sonner";
import { FiEdit2, FiTrash2, FiCheckCircle } from "react-icons/fi";
import {
  useDeleteSubscriptionMutation,
  useGetSubscriptionsQuery,
  useUpdateStatusMutation,
} from "../../../redux/features/subscriptions/subscriptions";
import { Link } from "react-router-dom";
import { formatPrice } from "../../../utils/currency";
import { apiErrorMessage } from "./planForm";

/* ---------------- Toggle ---------------- */
const Toggle = ({ checked, onChange, disabled = false }) => (
  <label
    className={`relative inline-block w-11 h-6 flex-shrink-0 z-10 ${
      disabled ? "cursor-wait opacity-60" : "cursor-pointer"
    }`}
  >
    <input
      type="checkbox"
      className="opacity-0 w-0 h-0"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <span
      className={`absolute inset-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-[#0F3D2E]" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </span>
  </label>
);

Toggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

/* ---------------- Plan Card ---------------- */
const PlanCard = ({ plan, onDelete, onStatusUpdate }) => {
  // The API serialises Mongo's `_id` as `id`.
  const planId = plan?.id ?? plan?._id;
  const [active, setActive] = useState(Boolean(plan?.isActive));
  const [isUpdating, setIsUpdating] = useState(false);

  // Follow the server's value once the list refetches.
  useEffect(() => {
    setActive(Boolean(plan?.isActive));
  }, [plan?.isActive]);

  const handleToggle = async () => {
    const prev = active;
    setActive(!prev); // optimistic UI
    setIsUpdating(true);
    try {
      await onStatusUpdate(planId);
    } catch (error) {
      setActive(prev); // rollback
      toast.error(apiErrorMessage(error, "Could not update the plan status. Please try again."));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 w-72 relative shadow-sm border border-gray-100 flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
            active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              active ? "bg-green-500" : "bg-red-400"
            }`}
          />
          {active ? "Active" : "Inactive"}
        </span>

        <div className="flex gap-4">
          <Link
            to={`/subscriptions/${planId}`}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiEdit2 size={15} />
          </Link>

          <button
            onClick={() => onDelete(planId)}
            className="text-red-400 hover:text-red-600"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <p className="text-[15px] font-bold text-gray-900">{plan?.name}</p>
        <p className="text-[12px] text-gray-400">{plan?.billingType} plan</p>
      </div>

      {/* Features */}
      <ul className="mt-3 space-y-2">
        {plan?.features?.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-[13px]">
            <FiCheckCircle size={14} className="text-gray-400" />
            {f}
          </li>
        ))}
      </ul>

      {/* Price */}
      <div className="mt-4">
        <p className="text-[28px] font-bold text-[#0F3D2E]">
          {formatPrice(plan?.price)}
        </p>
      </div>

      {/* Toggle */}
      <div className="flex justify-between items-center border-t pt-3 mt-4">
        <span className="text-sm text-gray-500">Active</span>

        <Toggle checked={active} onChange={handleToggle} disabled={isUpdating} />
      </div>
    </div>
  );
};

PlanCard.propTypes = {
  plan: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
};

/* ---------------- Main ---------------- */
const Subscriptions = () => {
  const { data: subscriptions, isLoading, isError } = useGetSubscriptionsQuery();

  const [deleteSubscription] = useDeleteSubscriptionMutation();
  const [updateStatus] = useUpdateStatusMutation();

  const handleDelete = async (id) => {
    try {
      const res = await deleteSubscription(id).unwrap();
      toast.success(res?.message || "Plan deleted successfully.");
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not delete the plan. Please try again."));
    }
  };

  // Errors propagate so the card can roll back its optimistic toggle.
  // The mutation invalidates the "subscriptions" tag, which refetches the list.
  const handleStatusUpdate = async (id) => {
    const res = await updateStatus(id).unwrap();
    toast.success(res?.message || "Plan status updated.");
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError) return <p className="text-center text-red-500">Error</p>;

  return (
    <section className="py-7">
      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-6 pl-1">
        <div>
          <h2 className="text-[22px] font-bold text-gray-900 mb-1">
            Subscription Plans
          </h2>

          <p className="hidden lg:block text-[16px] text-gray-400">
            Manage tiered pricing structures and marketplace access.
          </p>
        </div>

        <Link
          to="/AddSubscriptions"
          className="bg-[#0F3D2E] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1a5c44] transition-colors"
        >
          Add New Plan
        </Link>
      </div>
      <div className="flex gap-5 flex-wrap">
      
      {subscriptions?.map((plan) => (
        <PlanCard
          key={plan?.id ?? plan?._id}
          plan={plan}
          onDelete={handleDelete}
          onStatusUpdate={handleStatusUpdate}
        />
      ))}
    </div>
    </section>
  );
};

export default Subscriptions;