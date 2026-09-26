// src/component/Main/Coupon/Coupon.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { FiEdit2, FiTrash2, FiPlus, FiCalendar, FiX, FiTag } from "react-icons/fi";
import { BsTicketPerforated } from "react-icons/bs";
import { toast } from "sonner";

import {
  useGetCouponsQuery,
  useGetCouponStatsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "../../../redux/features/coupon/couponApi";
import { useGetCategoriesQuery } from "../../../redux/features/categories/categories";
import { formatPrice } from "../../../utils/currency";

/* ----------------------------------------
   STATUS HELPER  (derived from API fields)
---------------------------------------- */
const getStatus = (coupon) => {
  if (!coupon.isActive) return "inactive";
  const now = new Date();
  const expiry = new Date(coupon.expiryDate);
  if (expiry < now) return "expired";
  return "active";
};

const STATUS_CONFIG = {
  active: { label: "Active", bg: "bg-green-100", text: "text-green-700" },
  expired: { label: "Expired", bg: "bg-red-100", text: "text-red-500" },
  inactive: { label: "Inactive", bg: "bg-yellow-100", text: "text-yellow-700" },
};

/* ----------------------------------------
   EMPTY FORM
---------------------------------------- */
const EMPTY_FORM = {
  code: "",
  type: "percentage",
  value: "",
  usageLimit: "",
  expiryDate: "",
  categories: [],
};

/* ----------------------------------------
   CATEGORY SELECT COMPONENT
---------------------------------------- */
const CategorySelect = ({ selected, onChange, allCategories }) => {
  const [dropdownVal, setDropdownVal] = useState("");

  // Categories list API uses `id`, Coupon API uses `_id` — normalise to `id`
  const getId = (cat) => cat.id ?? cat._id;

  const handleAdd = (e) => {
    const id = e.target.value;
    setDropdownVal("");
    if (!id) return;
    const cat = allCategories.find((c) => getId(c) === id);
    if (cat && !selected.find((s) => getId(s) === id)) {
      onChange([...selected, { id: getId(cat), _id: getId(cat), title: cat.title }]);
    }
  };

  const remove = (id) => onChange(selected.filter((c) => getId(c) !== id));

  const unselected = allCategories.filter(
    (c) => !selected.find((s) => getId(s) === getId(c))
  );

  return (
    <div>
      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((cat) => (
            <span
              key={getId(cat)}
              className="flex items-center gap-1 bg-[#1a3a2a] text-white text-xs px-3 py-1 rounded-full"
            >
              {cat.title}
              <button
                type="button"
                onClick={() => remove(getId(cat))}
                className="ml-1 hover:opacity-70"
              >
                <FiX size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Controlled dropdown — resets after each pick */}
      {allCategories.length > 0 && (
        <select
          value={dropdownVal}
          onChange={handleAdd}
          className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#1a3a2a] cursor-pointer"
        >
          <option value="" disabled>
            {unselected.length === 0
              ? "All categories selected"
              : "— Select a category —"}
          </option>
          {unselected.map((c) => (
            <option key={getId(c)} value={getId(c)}>
              {c.title}
            </option>
          ))}
        </select>
      )}

      {allCategories.length === 0 && (
        <p className="text-xs text-gray-400">No categories available.</p>
      )}
    </div>
  );
};

/* ----------------------------------------
   COUPON MODAL
---------------------------------------- */
const CouponModal = ({ mode, initial, onClose, onSave, saving }) => {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const { data: allCategories = [] } = useGetCategoriesQuery();

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-[470px] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {mode === "create" ? "Create New Coupon" : "Edit Coupon"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Coupon Code */}
          <div>
            <label className="block text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-1.5">
              Coupon Code
            </label>
            <textarea
              value={form.code}
              onChange={(e) => set("code", e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              rows={2}
              required
              className="w-full text-sm border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-1 focus:ring-[#1a3a2a] focus:bg-white transition"
            />
          </div>

          {/* Type + Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-1.5">
                Type
              </label>
              <div className="relative">
                <select
                  value={form.type}
                  onChange={(e) => set("type", e.target.value)}
                  className="w-full appearance-none text-sm border border-gray-200 rounded-xl px-4 py-2.5 pr-8 bg-white focus:outline-none focus:ring-1 focus:ring-[#1a3a2a] cursor-pointer"
                >
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat Amount</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ▾
                </span>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-1.5">
                Value
              </label>
              <input
                type="number"
                min="0"
                value={form.value}
                onChange={(e) => set("value", e.target.value)}
                placeholder={form.type === "percentage" ? "e.g. 20" : "e.g. 50.00"}
                required
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]"
              />
            </div>
          </div>

          {/* Valid Categories */}
          <div>
            <label className="block text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-2">
              Valid Categories
            </label>
            <CategorySelect
              selected={form.categories}
              onChange={(cats) => set("categories", cats)}
              allCategories={allCategories}
            />
          </div>

          {/* Expiry + Usage Limit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-1.5">
                Expiry Date
              </label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => set("expiryDate", e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-1.5">
                Usage Limit
              </label>
              <input
                type="number"
                min="0"
                value={form.usageLimit}
                onChange={(e) => set("usageLimit", e.target.value)}
                placeholder="Unlimited"
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1a3a2a]"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-[#1a3a2a] text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : mode === "create"
                ? "Save Coupon"
                : "Update Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ----------------------------------------
   DELETE CONFIRM MODAL
---------------------------------------- */
const DeleteModal = ({ code, onConfirm, onCancel, deleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="bg-white rounded-2xl w-full max-w-[380px] shadow-xl p-6 text-center">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <FiTrash2 size={24} className="text-red-500" />
      </div>
      <h2 className="text-base font-semibold text-gray-900 mb-1">Delete Coupon?</h2>
      <p className="text-sm text-gray-500 mb-6">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-gray-800">{code}</span>? This
        action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          No, Keep It
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
);

/* ----------------------------------------
   COUPON CARD
---------------------------------------- */
const CouponCard = ({ coupon, onEdit, onDelete }) => {
  const status = getStatus(coupon);
  const st = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;
  const isExpired = status === "expired";

  const formatExpiry = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatValue = () => {
    if (coupon.type === "percentage") return `${coupon.value}% Off`;
    return `${formatPrice(coupon.value)} Flat`;
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 ${
        isExpired ? "opacity-70" : ""
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <span
          className={`text-[17px] font-bold tracking-wide ${
            isExpired ? "text-gray-400 line-through" : "text-gray-900"
          }`}
        >
          {coupon.code}
        </span>
        <span
          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${st.bg} ${st.text}`}
        >
          {st.label}
        </span>
      </div>

      {/* Discount + Usage */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">
            Discount
          </p>
          <p
            className={`text-sm font-semibold ${
              isExpired ? "text-gray-400" : "text-blue-600"
            }`}
          >
            {formatValue()}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">
            Usage
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {coupon.usage} / {coupon.usageLimit ?? "Unlimited"}
          </p>
        </div>
      </div>

      {/* Categories */}
      {coupon.categories?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {coupon.categories.map((cat) => (
            <span
              key={cat.id ?? cat._id}
              className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {cat.title}
            </span>
          ))}
        </div>
      )}

      {/* Expiry */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <FiCalendar size={12} />
        <span>
          {isExpired ? "Expired" : "Expires"} {formatExpiry(coupon.expiryDate)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1 border-t border-gray-100 mt-1">
        <button
          onClick={() => onEdit(coupon)}
          className="text-gray-400 hover:text-gray-700 transition p-1"
          title="Edit"
        >
          <FiEdit2 size={15} />
        </button>
        <button
          onClick={() => onDelete(coupon)}
          className="text-gray-400 hover:text-red-500 transition p-1"
          title="Delete"
        >
          <FiTrash2 size={15} />
        </button>
      </div>
    </div>
  );
};

/* ----------------------------------------
   MAIN COMPONENT
---------------------------------------- */
const Coupon = () => {
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: coupons = [], isLoading, isError } = useGetCouponsQuery();
  const { data: stats } = useGetCouponStatsQuery();

  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: updating }] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: deleting }] = useDeleteCouponMutation();

  const buildPayload = (form) => ({
    code: form.code,
    type: form.type,
    value: Number(form.value),
    categories: form.categories.map((c) => c.id ?? c._id),
    expiryDate: form.expiryDate
      ? new Date(form.expiryDate).toISOString()
      : undefined,
    usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
  });

  const handleSave = async (form) => {
    try {
      if (modal.mode === "create") {
        await createCoupon(buildPayload(form)).unwrap();
        toast.success("Coupon created successfully.");
      } else {
        await updateCoupon({
          id: modal.coupon._id,
          data: buildPayload(form),
        }).unwrap();
        toast.success("Coupon updated successfully.");
      }
      setModal(null);
    } catch (err) {
      toast.error(err?.data?.message ?? "Something went wrong.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCoupon(deleteTarget._id).unwrap();
      toast.success("Coupon deleted.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to delete coupon.");
    }
  };

  const editInitial = (coupon) => ({
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    usageLimit: coupon.usageLimit ?? "",
    expiryDate: coupon.expiryDate
      ? new Date(coupon.expiryDate).toISOString().split("T")[0]
      : "",
    categories: coupon.categories ?? [],
  });

  return (
    <div className="py-4">
      {/* ---- Stats ---- */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
              Active Coupons
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {stats?.activeCouponsCount ?? 0}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
            <BsTicketPerforated size={20} className="text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
              Total Usage
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {stats?.totalUsageCount?.toLocaleString() ?? 0}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
            <FiTag size={18} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* ---- Header row ---- */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BsTicketPerforated size={20} className="text-green-500" />
          <h2 className="text-base font-semibold text-green-500 tracking-wide">
            Coupon
          </h2>
        </div>
        <button
          onClick={() => setModal({ mode: "create" })}
          className="flex items-center gap-2 bg-[#1a3a2a] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition"
        >
          <FiPlus size={15} />
          Create Coupon
        </button>
      </div>

      {/* ---- Loading / Error ---- */}
      {isLoading && (
        <p className="text-sm text-gray-400 text-center py-10">
          Loading coupons...
        </p>
      )}
      {isError && (
        <p className="text-sm text-red-500 text-center py-10">
          Failed to load coupons.
        </p>
      )}

      {/* ---- Grid ---- */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon._id}
              coupon={coupon}
              onEdit={(c) => setModal({ mode: "edit", coupon: c })}
              onDelete={(c) => setDeleteTarget(c)}
            />
          ))}

          {/* Create new card */}
          <button
            onClick={() => setModal({ mode: "create" })}
            className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 min-h-[180px] text-gray-400 hover:border-gray-400 hover:text-gray-600 transition"
          >
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
              <FiPlus size={18} />
            </div>
            <span className="text-sm font-medium">Create New Coupon</span>
          </button>
        </div>
      )}

      {/* ---- Create / Edit Modal ---- */}
      {modal && (
        <CouponModal
          mode={modal.mode}
          initial={modal.mode === "edit" ? editInitial(modal.coupon) : EMPTY_FORM}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={creating || updating}
        />
      )}

      {/* ---- Delete Confirm Modal ---- */}
      {deleteTarget && (
        <DeleteModal
          code={deleteTarget.code}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
};

export default Coupon;

// ─── PropTypes ────────────────────────────────────────────────────────────────

CategorySelect.propTypes = {
  selected: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      _id: PropTypes.string,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  allCategories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      _id: PropTypes.string,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

CouponModal.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]).isRequired,
  initial: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

DeleteModal.propTypes = {
  code: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  deleting: PropTypes.bool,
};

CouponCard.propTypes = {
  coupon: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    usage: PropTypes.number.isRequired,
    usageLimit: PropTypes.number,
    expiryDate: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        _id: PropTypes.string,
        title: PropTypes.string,
      })
    ),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};