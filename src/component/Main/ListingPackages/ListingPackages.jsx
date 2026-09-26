import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "sonner";
import { FiTrash2, FiPlus, FiX, FiEdit2 } from "react-icons/fi";
import {
  useGetListingPackagesQuery,
  useAddListingPackageMutation,
  useUpdateListingPackageMutation,
  useDeleteListingPackageMutation,
  useToggleListingPackageStatusMutation,
} from "../../../redux/features/listingPackages/listingPackages";
import { useGetCategoriesQuery } from "../../../redux/features/categories/categories";
import { CURRENCY, formatPrice } from "../../../utils/currency";

/* ---------------- Toggle ---------------- */
const Toggle = ({ checked, onChange }) => (
  <label className="relative inline-block w-11 h-6 cursor-pointer flex-shrink-0">
    <input type="checkbox" className="opacity-0 w-0 h-0" checked={checked} onChange={onChange} />
    <span className={`absolute inset-0 rounded-full transition-colors duration-200 ${checked ? "bg-[#0F3D2E]" : "bg-gray-300"}`}>
      <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </span>
  </label>
);
Toggle.propTypes = { checked: PropTypes.bool.isRequired, onChange: PropTypes.func.isRequired };

const emptyForm = { name: "", category: "", durationHours: "", price: "", maxListings: 1, currency: CURRENCY, validityDays: 30 };

/* ---------------- Package Card ---------------- */
const PackageCard = ({ pkg, onEdit, onDelete, onToggle }) => {
  const [active, setActive] = useState(pkg?.isActive);

  const handleToggle = async () => {
    const prev = active;
    setActive(!prev);
    try {
      await onToggle(pkg._id || pkg.id);
    } catch {
      setActive(prev);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 w-72 relative shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-3">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-red-400"}`} />
          {active ? "Active" : "Inactive"}
        </span>
        <div className="flex gap-4">
          <button onClick={() => onEdit(pkg)} className="text-gray-400 hover:text-gray-600"><FiEdit2 size={15} /></button>
          <button onClick={() => onDelete(pkg._id || pkg.id)} className="text-red-400 hover:text-red-600"><FiTrash2 size={15} /></button>
        </div>
      </div>

      <p className="text-[15px] font-bold text-gray-900">{pkg.name}</p>
      <p className="text-[12px] text-gray-400 mb-3">{pkg.category?.title || "No category"}</p>

      <div className="space-y-1 text-sm text-gray-600 mb-3">
        <p>Duration: <span className="font-medium text-gray-800">{pkg.durationHours}h</span></p>
        <p>Max Listings: <span className="font-medium text-gray-800">{pkg.maxListings}</span></p>
        <p>Validity: <span className="font-medium text-gray-800">{pkg.validityDays} days</span></p>
      </div>

      <p className="text-[28px] font-bold text-[#0F3D2E]">{formatPrice(pkg.price)}</p>

      <div className="flex justify-between items-center border-t pt-3 mt-4">
        <span className="text-sm text-gray-500">Active</span>
        <Toggle checked={active} onChange={handleToggle} />
      </div>
    </div>
  );
};
PackageCard.propTypes = { pkg: PropTypes.object.isRequired, onEdit: PropTypes.func.isRequired, onDelete: PropTypes.func.isRequired, onToggle: PropTypes.func.isRequired };

/* ---------------- Main ---------------- */
const ListingPackages = () => {
  const { data: packages, isLoading, isError } = useGetListingPackagesQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [addListingPackage] = useAddListingPackageMutation();
  const [updateListingPackage] = useUpdateListingPackageMutation();
  const [deleteListingPackage] = useDeleteListingPackageMutation();
  const [toggleStatus] = useToggleListingPackageStatusMutation();

  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const setField = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  // ── Add ──
  const handleAdd = async () => {
    try {
      await addListingPackage({
        name: form.name,
        category: form.category,
        durationHours: Number(form.durationHours),
        price: Number(form.price),
        maxListings: Number(form.maxListings),
        currency: form.currency,
        validityDays: Number(form.validityDays),
      }).unwrap();
      toast.success("Listing package created");
      setAddOpen(false);
      setForm(emptyForm);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create package");
    }
  };

  // ── Edit ──
  const handleOpenEdit = (pkg) => {
    setEditItem(pkg);
    setForm({
      name: pkg.name,
      category: pkg.category?._id || pkg.category?.id || pkg.category || "",
      durationHours: pkg.durationHours,
      price: pkg.price,
      maxListings: pkg.maxListings,
      currency: CURRENCY,
      validityDays: pkg.validityDays || 30,
    });
  };

  const handleEdit = async () => {
    try {
      await updateListingPackage({
        id: editItem._id || editItem.id,
        data: {
          name: form.name,
          category: form.category,
          durationHours: Number(form.durationHours),
          price: Number(form.price),
          maxListings: Number(form.maxListings),
          currency: form.currency,
          validityDays: Number(form.validityDays),
        },
      }).unwrap();
      toast.success("Package updated");
      setEditItem(null);
      setForm(emptyForm);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update package");
    }
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    try {
      await deleteListingPackage(id).unwrap();
      toast.success("Package deleted");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete package");
    }
  };

  // ── Toggle ──
  const handleToggle = async (id) => {
    await toggleStatus(id).unwrap();
  };

  // ── Modal ──
  const isModalOpen = addOpen || editItem;
  const closeModal = () => { setAddOpen(false); setEditItem(null); setForm(emptyForm); };

  const renderModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={closeModal}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"><FiX size={20} /></button>
        <h2 className="text-lg font-bold text-gray-800 mb-5">{editItem ? "Edit" : "Add"} Listing Package</h2>

        <label className="block text-sm font-semibold text-gray-700 mb-1">Package Name</label>
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" placeholder="Enter name" value={form.name} onChange={(e) => setField("name", e.target.value)} />

        <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" value={form.category} onChange={(e) => setField("category", e.target.value)}>
          <option value="">Select category</option>
          {categories?.map((cat) => (
            <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.title}</option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (hours)</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" type="number" placeholder="24" value={form.durationHours} onChange={(e) => setField("durationHours", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" type="number" placeholder="9.99" value={form.price} onChange={(e) => setField("price", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Max Listings</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" type="number" placeholder="1" value={form.maxListings} onChange={(e) => setField("maxListings", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Currency</label>
            <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500">{CURRENCY}</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Validity (days)</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" type="number" placeholder="30" value={form.validityDays} onChange={(e) => setField("validityDays", e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={closeModal} className="flex-1 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button onClick={editItem ? handleEdit : handleAdd} className="flex-1 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition" style={{ background: "#1a3c34" }}>
            {editItem ? "Save Changes" : "Create Package"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-7">
      <div className="flex justify-between items-start gap-4 mb-6 pl-1">
        <div>
          <h2 className="text-[22px] font-bold text-gray-900 mb-1">Listing Packages</h2>
          <p className="hidden lg:block text-[16px] text-gray-400">Manage per-category listing pricing packages.</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setAddOpen(true); }} className="flex items-center gap-2 bg-[#0F3D2E] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1a5c44] transition-colors">
          <FiPlus size={16} /> Add Package
        </button>
      </div>

      {isLoading && <p className="text-center py-10">Loading...</p>}
      {isError && <p className="text-center text-red-500">Error loading packages</p>}

      {!isLoading && !isError && (
        <div className="flex gap-5 flex-wrap">
          {packages?.map((pkg) => (
            <PackageCard key={pkg._id || pkg.id} pkg={pkg} onEdit={handleOpenEdit} onDelete={handleDelete} onToggle={handleToggle} />
          ))}
        </div>
      )}

      {isModalOpen && renderModal()}
    </section>
  );
};

export default ListingPackages;
