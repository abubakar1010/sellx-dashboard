/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Table,
  ConfigProvider,
  Modal,
  Upload,
  Input,
  InputNumber,
  Switch,
} from "antd";

import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { RiCloudLine } from "react-icons/ri";
import { toast } from "sonner";

import CategoriesStatus from "./CategoriesStatus";

import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../../redux/features/categories/categories";

import { imageBaseUrl } from "../../../config/imageBaseUrl";

const { Dragger } = Upload;

const initialFormState = {
  title: "",
  description: "",
  basicPricing: 5,
  plusPricing: 49,
  sortOrder: 1,
  isActive: true,
  slug: "",
};

const ModalBody = ({
  formData,
  onFieldChange,
  previewImage,
  thumbnail,
  onThumbnailChange,
  onClose,
  onSave,
  loading,
}) => (
  <>
    {/* Title */}
    <div className="mt-3 mb-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Category Title
      </label>
      <Input
        placeholder="Enter category title"
        value={formData.title}
        onChange={(e) => onFieldChange("title", e.target.value)}
        size="large"
      />
    </div>

    {/* Description */}
    <div className="mb-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description
      </label>
      <Input.TextArea
        rows={4}
        placeholder="Enter description"
        value={formData.description}
        onChange={(e) => onFieldChange("description", e.target.value)}
      />
    </div>

    <div className="flex justify-between space-x-2">
      {/* Basic Pricing */}
      <div className="mb-4 w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Basic Pricing
        </label>
        <InputNumber
          className="w-full"
          size="large"
          min={0}
          value={formData.basicPricing}
          onChange={(value) => onFieldChange("basicPricing", value)}
        />
      </div>

      {/* Plus Pricing */}
      <div className="mb-4 w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Plus Pricing
        </label>
        <InputNumber
          className="w-full"
          size="large"
          min={0}
          value={formData.plusPricing}
          onChange={(value) => onFieldChange("plusPricing", value)}
        />
      </div>
    </div>

    <div className="flex justify-between space-x-2">
      {/* Sort Order */}
      <div className="mb-1 w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Sort Order
        </label>
        <InputNumber
          className="w-full"
          size="large"
          min={1}
          value={formData.sortOrder}
          onChange={(value) => onFieldChange("sortOrder", value)}
        />
      </div>

      {/* Slug */}
      <div className="mb-1 w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Slug
        </label>
        <Input
          placeholder="electronics"
          value={formData.slug}
          onChange={(e) => onFieldChange("slug", e.target.value)}
          size="large"
        />
      </div>
    </div>

    {/* Active */}
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">Active Status</span>
      <Switch
        checked={formData.isActive}
        onChange={(checked) => onFieldChange("isActive", checked)}
      />
    </div>

    {/* Thumbnail Upload */}
    <div className="h-[250px]">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Category Thumbnail
        </label>
        <Dragger
          accept="image/png,image/jpg,image/jpeg"
          multiple={false}
          showUploadList={false}
          openFileDialogOnClick={true}
          beforeUpload={onThumbnailChange}
          style={{
            background: "#fff",
            border: "1.5px dashed #e5e7eb",
            borderRadius: 12,
          }}
        >
          <div className="flex flex-col items-center">
            <RiCloudLine className="text-[#0F3D2E] mb-1" size={20} />
            <p className="text-xs font-medium text-gray-700">Choose a file</p>
            <img
              src={previewImage || ""}
              crossOrigin="anonymous"
              alt="preview"
              className="w-16 h-16 object-cover"
              onError={(e) => {
                e.target.src = "";
              }}
            />
            {thumbnail && (
              <p className="text-xs text-green-600 mt-2">{thumbnail?.name}</p>
            )}
            <div className="mt-3 border border-gray-200 rounded-lg px-5 text-sx text-gray-600 bg-white hover:bg-gray-50 transition">
              Browse File
            </div>
          </div>
        </Dragger>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={loading}
          className="flex-[2] py-2.5 rounded-xl bg-[#1a4731] text-sm font-semibold text-white hover:bg-[#153a27] transition disabled:opacity-60"
        >
          {loading ? "Loading..." : "Save Category"}
        </button>
      </div>
    </div>
  </>
);

const CategoriesTable = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const [thumbnail, setThumbnail] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState("");

  const { data, refetch, isLoading } = useGetCategoriesQuery();
  const [DeleteCategory] = useDeleteCategoryMutation();
  const [addCategory, { isLoading: addLoading }] = useAddCategoryMutation();
  const [UpdateCategory, { isLoading: updateLoading }] = useUpdateCategoryMutation();

  // ─────────────────────────────────────────────
  // Table Data
  // ─────────────────────────────────────────────
  const dataSource = (data || []).map((item) => ({
    key: item.id || item._id,
    thumbnail: item.thumbnail,
    name: item.title,
    description: item.description,
    basicPricing: item.basicPricing,
    plusPricing: item.plusPricing,
    sortOrder: item.sortOrder,
    slug: item.slug,
    active_listings: item.active_listings,
    listings: item.total_listings?.toLocaleString() ?? "0",
    pending: `${item.total_listings - item.active_listings} pending review`,
    isActive: item.isActive,
  }));

  // ─────────────────────────────────────────────
  // Input Change
  // ─────────────────────────────────────────────
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ─────────────────────────────────────────────
  // Reset Form
  // ─────────────────────────────────────────────
  const resetForm = () => {
    setFormData(initialFormState);
    setThumbnail(null);
    setPreviewImage("");
    setExistingThumbnailUrl("");
    setSelectedCategoryId(null);
  };

  // ─────────────────────────────────────────────
  // Delete
  // ─────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      const res = await DeleteCategory(id).unwrap();
      if (res?.success) {
        toast.success("Category deleted successfully");
        refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Delete failed");
    }
  };

  // ─────────────────────────────────────────────
  // Add Modal
  // ─────────────────────────────────────────────
  const handleAddOpen = () => {
    resetForm();
    setAddModalOpen(true);
  };

  const handleAddClose = () => {
    setAddModalOpen(false);
    resetForm();
  };

  // ─────────────────────────────────────────────
  // Edit Modal
  // ─────────────────────────────────────────────
  const handleEditClick = (record) => {
    setSelectedCategoryId(record.key);

    setFormData({
      title: record.name || "",
      description: record.description || "",
      basicPricing: record.basicPricing || 5,
      plusPricing: record.plusPricing || 49,
      sortOrder: record.sortOrder || 1,
      isActive: record.isActive,
      slug: record.slug || "",
    });

    setThumbnail(null);

    const rawPath = record.thumbnail || "";
    console.log(rawPath)
    setExistingThumbnailUrl(rawPath);

    // Build a full URL for the preview image
    const fullPreviewUrl = rawPath.startsWith("http")
      ? rawPath
      : rawPath
      ? `${imageBaseUrl}${rawPath}`
      : "";
    setPreviewImage(fullPreviewUrl);

    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    resetForm();
  };

  // ─────────────────────────────────────────────
  // Upload Image
  // ─────────────────────────────────────────────
  const handleThumbnailChange = (file) => {
    setThumbnail(file);
    setPreviewImage(URL.createObjectURL(file));
    return false; // prevent antd auto-upload
  };

  // ─────────────────────────────────────────────
  // Helper to construct full URL
  // ─────────────────────────────────────────────
  const getFullThumbnailUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const base = imageBaseUrl.endsWith("/")
      ? imageBaseUrl.slice(0, -1)
      : imageBaseUrl;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath}`;
  };

  // ─────────────────────────────────────────────
  // Add Category
  // ─────────────────────────────────────────────
  const handleAddCategory = async () => {
    try {
      const form = new FormData();

      const payload = {
        title: formData.title,
        description: formData.description,
        basicPricing: Number(formData.basicPricing),
        plusPricing: Number(formData.plusPricing),
        sortOrder: Number(formData.sortOrder),
        isActive: formData.isActive,
        slug: formData.slug,
      };

      form.append("data", JSON.stringify(payload));

      if (thumbnail) {
        form.append("thumbnail", thumbnail);
      }

      const res = await addCategory(form).unwrap();

      if (res?.success) {
        toast.success("Category added successfully");
        handleAddClose();
        refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Add failed");
    }
  };

  // ─────────────────────────────────────────────
  // Update Category
  // FIX: Always send a full valid URL for thumbnail in the JSON payload,
  // even if a new file is chosen, to satisfy the backend's Zod URL validation.
  // ─────────────────────────────────────────────
  const handleUpdateCategory = async () => {
    try {
      const form = new FormData();

      const payload = {
        title: formData.title,
        description: formData.description,
        basicPricing: Number(formData.basicPricing),
        plusPricing: Number(formData.plusPricing),
        sortOrder: Number(formData.sortOrder),
        isActive: formData.isActive,
        slug: formData.slug,
      };

      // Ensure 'thumbnail' is a valid URL in the JSON payload.
      if (thumbnail) {

        payload.thumbnail = existingThumbnailUrl 
          ? getFullThumbnailUrl(existingThumbnailUrl)
          : "";
      } else if (existingThumbnailUrl) {
        payload.thumbnail = getFullThumbnailUrl(existingThumbnailUrl);
      }

      form.append("data", JSON.stringify(payload));

      if (thumbnail) {
        form.append("thumbnail", thumbnail);
      }

      const res = await UpdateCategory({
        id: selectedCategoryId,
        data: form,
      }).unwrap();

      if (res?.success) {
        toast.success("Category updated successfully");
        handleEditClose();
        refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Update failed");
    }
  };

  // ─────────────────────────────────────────────
  // Table Columns
  // ─────────────────────────────────────────────
  const columns = [
    {
      title: "CATEGORY NAME",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={
                record.thumbnail
                  ? `${imageBaseUrl}${record.thumbnail}`
                  : ""
              }
              crossOrigin="anonymous"
              alt={record.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "";
              }}
            />
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">
              {record.name}
            </div>
            <div className="text-xs text-gray-400">{record.description}</div>
          </div>
        </div>
      ),
    },
    {
      title: "ACTIVE LISTINGS",
      render: (_, record) => (
        <div>
          <div className="font-bold text-gray-900 text-sm">{record.listings}</div>
          <div className="text-xs text-gray-400">{record.pending}</div>
        </div>
      ),
    },
    {
      title: "STATUS",
      render: (_, record) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            record.isActive
              ? "bg-emerald-100 text-emerald-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {record.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "ACTIONS",
      render: (_, record) => (
        <div className="flex gap-5">
          <button
            onClick={() => handleEditClick(record)}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <FiEdit2 size={15} />
          </button>
          <button
            onClick={() => handleDelete(record.key)}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-500 transition"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Modals */}
      <ConfigProvider
        theme={{
          components: {
            Modal: { borderRadiusLG: 16 },
          },
        }}
      >
        {/* Add Modal */}
        <Modal
          open={addModalOpen}
          onCancel={handleAddClose}
          footer={null}
          width={550}
          centered
          destroyOnClose
          closeIcon={<FiX size={18} className="text-gray-400 hover:text-gray-600" />}
          title={
            <span className="text-lg font-bold text-gray-900">
              Add Category
            </span>
          }
        >
          <ModalBody
            formData={formData}
            onFieldChange={handleChange}
            previewImage={previewImage}
            thumbnail={thumbnail}
            onThumbnailChange={handleThumbnailChange}
            onClose={handleAddClose}
            onSave={handleAddCategory}
            loading={addLoading}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          open={editModalOpen}
          onCancel={handleEditClose}
          footer={null}
          width={550}
          centered
          destroyOnClose
          closeIcon={<FiX size={18} className="text-gray-400 hover:text-gray-600" />}
          title={
            <span className="text-lg font-bold text-gray-900">
              Edit Category
            </span>
          }
        >
          <ModalBody
            formData={formData}
            onFieldChange={handleChange}
            previewImage={previewImage}
            thumbnail={thumbnail}
            onThumbnailChange={handleThumbnailChange}
            onClose={handleEditClose}
            onSave={handleUpdateCategory}
            loading={updateLoading}
          />
        </Modal>
      </ConfigProvider>

      {/* Table */}
      <section>
        <CategoriesStatus onAddCategory={handleAddOpen} />

        <div className="bg-white rounded-2xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-5 px-3">
            <h2 className="text-lg xl:text-xl font-bold text-gray-900">
              Categories
            </h2>
            <button
              onClick={handleAddOpen}
              className="bg-[#0F3D2E] text-white font-bold py-2 px-4 rounded-md transition"
            >
              Add Category
            </button>
          </div>

          <ConfigProvider
            theme={{
              components: {
                Table: {
                  headerBg: "#FFFFFF",
                  headerColor: "#9ca3af",
                  borderRadiusLG: 12,
                  fontSize: 12,
                },
              },
            }}
          >
            <Table
              loading={isLoading}
              dataSource={dataSource}
              columns={columns}
              pagination={{ pageSize: 10, position: ["bottomRight"] }}
              scroll={{ x: "max-content" }}
            />
          </ConfigProvider>
        </div>
      </section>
    </>
  );
};

export default CategoriesTable;