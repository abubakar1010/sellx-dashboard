import { useState } from "react";
import { useAddBoostingMutation, useDeleteBoostingMutation, useGetBoostingQuery, useUpdateBoostingMutation } from "../../../redux/features/boosting/boosting";
import { FiClock, FiTrash2, FiPlus, FiMinus, FiX, FiTrendingUp, FiEye, FiBarChart2 } from "react-icons/fi";
import { formatPrice } from "../../../utils/currency";

const AllBoosting = () => {
  const { data: boostingData, isLoading, isError } = useGetBoostingQuery();
  const [addBoosting] = useAddBoostingMutation();
  const [updateBoosting] = useUpdateBoostingMutation();
  const [deleteBoosting] = useDeleteBoostingMutation();

  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [addForm, setAddForm] = useState({ name: "", description: "", features: ["", ""], durationHours: "", price: "" });
  const [editForm, setEditForm] = useState(null);

  const features = [
    { icon: FiTrendingUp, label: "Appear at top of search" },
    { icon: FiBarChart2, label: "Increase chances of sale" },
    { icon: FiEye, label: "Get more views" },
  ];
  // ── Add form handlers ──
  const handleOpenAdd = () => setAddOpen(true);
  const setAdd = (key, val) => setAddForm((p) => ({ ...p, [key]: val }));
  const setAddFeature = (i, val) => {
    const f = [...addForm.features];
    f[i] = val;
    setAdd("features", f);
  };
  const addFeatureRow = () => setAdd("features", [...addForm.features, ""]);
  const removeAddFeatureRow = (i) => {
    if (addForm.features.length <= 1) return;
    setAdd("features", addForm.features.filter((_, idx) => idx !== i));
  };

  const handleAdd = async () => {
    try {
      await addBoosting({
        name: addForm.name,
        description: addForm.description,
        durationHours: Number(addForm.durationHours),
        price: Number(addForm.price),
      }).unwrap();
      setAddOpen(false);
      setAddForm({ name: "", description: "", features: ["", ""], durationHours: "", price: "" });
    } catch (error) {
      console.log(error);
    }
  };
  // ── Edit form handlers ──
  const handleOpenEdit = (item) => {
    setEditItem(item);
    setEditForm({
      name: item.name,
      description: item.description,
      features: ["Appear at top of search", "Increase chances of sale", "Get more views"],
      durationHours: item.durationHours,
      price: item.price,
    });
  };
  const setEdit = (key, val) => setEditForm((p) => ({ ...p, [key]: val }));
  const setEditFeature = (i, val) => {
    const f = [...editForm.features];
    f[i] = val;
    setEdit("features", f);
  };
  const addEditFeatureRow = () => setEdit("features", [...editForm.features, ""]);
  const removeEditFeatureRow = (i) => {
    if (editForm.features.length <= 1) return;
    setEdit("features", editForm.features.filter((_, idx) => idx !== i));
  };

  const handleEdit = async () => {
    try {
     const result = await updateBoosting({
        id: editItem._id,
        data: {
          name: editForm.name,
          description: editForm.description,
          durationHours: Number(editForm.durationHours),
          price: Number(editForm.price),
        },
      }).unwrap();
      if (result) {
          setEditItem(null);
          setEditForm(null);
      }
      setEditItem(null);
      setEditForm(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBoosting(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">All Boosting</h2>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition"
          style={{ background: "#1a3c34" }}
        >
          <FiPlus size={16} />
          Add Boosting
        </button>
      </div>

      {/* ── States ── */}
      {isLoading && <p className="text-center text-gray-400 mt-20 text-sm">Loading...</p>}
      {isError && <p className="text-center text-red-400 mt-20 text-sm">Failed to load boosting data.</p>}

      {/* ── Cards Grid ── */}
      {!isLoading && !isError && boostingData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {boostingData.map((item) => (
            <div
              key={item._id}
              className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative"
            >
              {/* Delete btn */}
              <button
                onClick={() => handleDelete(item._id)}
                className="absolute top-3 left-3 text-red-400 hover:text-red-600 transition"
              >
                <FiTrash2 size={16} />
              </button>

              <h1 className="text-lg font-bold text-gray-800 mb-1 -mt-5">{item.name}</h1>

              {/* Clock icon */}
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full mb-3"
                style={{ background: "#e8f5e9" }}
              >
                <FiClock size={22} style={{ color: "#1a3c34" }} />
              </div>

              {/* Price */}
              <p className="text-3xl font-bold text-gray-900 mb-1">{formatPrice(item.price)}</p>

              {/* Description */}
              <p className="text-sm font-semibold text-gray-700 mb-1">{item.description}</p>
              <p className="text-xs text-gray-400 text-center mb-4 leading-relaxed">
                Standard visibility for quick sales and daily promotions.
              </p>

              {/* Features */}
              <ul className="w-full flex flex-col justify-center gap-2 mb-6">
                {features.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2 text-xs text-gray-600">
                    <Icon size={13} style={{ color: "#1a3c34" }} />
                    {label}
                  </li>
                ))}
              </ul>

              {/* Edit btn */}
              <button
                onClick={() => handleOpenEdit(item)}
                className="w-full py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition"
                style={{ background: "#1a3c34" }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════
          ADD MODAL
      ══════════════════════════════════════════ */}
      {addOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setAddOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAddOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-lg font-bold text-gray-800 mb-5">Add Boosting Prices & details</h2>

            <label className="block text-sm font-semibold text-gray-700 mb-1">Boosting Title</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50"
              placeholder="Enter Title"
              value={addForm.name}
              onChange={(e) => setAdd("name", e.target.value)}
            />

            <label className="block text-sm font-semibold text-gray-700 mb-1">Boosting Descriptions</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50"
              placeholder="Enter Start Descriptions"
              value={addForm.description}
              onChange={(e) => setAdd("description", e.target.value)}
            />

            <label className="block text-sm font-semibold text-gray-700 mb-2">Boosting Features</label>
            <div className="flex flex-col gap-2 mb-4">
              {addForm.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50"
                    placeholder="Add Features"
                    value={f}
                    onChange={(e) => setAddFeature(i, e.target.value)}
                  />
                  {i === addForm.features.length - 1 ? (
                    <button
                      onClick={addFeatureRow}
                      className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:border-green-700 hover:text-green-800 transition"
                    >
                      <FiPlus size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => removeAddFeatureRow(i)}
                      className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-500 transition"
                    >
                      <FiMinus size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Boosting Duration</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50"
                  placeholder="Enter Amount"
                  type="number"
                  value={addForm.durationHours}
                  onChange={(e) => setAdd("durationHours", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Boosting Pricing</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50"
                  placeholder="Enter Amount"
                  type="number"
                  value={addForm.price}
                  onChange={(e) => setAdd("price", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setAddOpen(false)}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition"
                style={{ background: "#1a3c34" }}
              >
                Save Pricing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          EDIT MODAL
      ══════════════════════════════════════════ */}
      {editItem && editForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => { setEditItem(null); setEditForm(null); }}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { setEditItem(null); setEditForm(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-lg font-bold text-gray-800 mb-5">Edit Boosting Prices & details</h2>

            <label className="block text-sm font-semibold text-gray-700 mb-1">Boosting Title</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50"
              placeholder="Enter Title"
              value={editForm.name}
              onChange={(e) => setEdit("name", e.target.value)}
            />

            <label className="block text-sm font-semibold text-gray-700 mb-1">Boosting Descriptions</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50"
              placeholder="Enter Start Descriptions"
              value={editForm.description}
              onChange={(e) => setEdit("description", e.target.value)}
            />

            <label className="block text-sm font-semibold text-gray-700 mb-2">Boosting Features</label>
            <div className="flex flex-col gap-2 mb-4">
              {editForm.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50"
                    placeholder="Add Features"
                    value={f}
                    onChange={(e) => setEditFeature(i, e.target.value)}
                  />
                  {i === editForm.features.length - 1 ? (
                    <button
                      onClick={addEditFeatureRow}
                      className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:border-green-700 hover:text-green-800 transition"
                    >
                      <FiPlus size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => removeEditFeatureRow(i)}
                      className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-500 transition"
                    >
                      <FiMinus size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Boosting Duration</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50"
                  placeholder="Enter Amount"
                  type="number"
                  value={editForm.durationHours}
                  onChange={(e) => setEdit("durationHours", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Boosting Pricing</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-50"
                  placeholder="Enter Amount"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEdit("price", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setEditItem(null); setEditForm(null); }}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="flex-1 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition"
                style={{ background: "#1a3c34" }}
              >
                Save Pricing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AllBoosting;