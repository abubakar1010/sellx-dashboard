/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import { Form, Modal } from "antd";
import { useEffect, useState } from "react";
import CustomInput from "../../../utils/CustomInput";
import profile from "/logo/profile.jpg";
import { toast } from "sonner";
import { useChangePasswordMutation, useGetUserQuery } from "../../../redux/features/profile/profileApi";
import { LockOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

// ─── PasswordField Component ─────────────────
const PasswordField = ({ value, onChange, placeholder, show, toggleShow }) => {
  return (
    <div className="flex items-center gap-3 bg-[#f5f5f5] border border-[#e0e0e0] rounded-lg px-4 py-[11px]">
      <LockOutlined style={{ color: "#aaa", fontSize: "15px" }} />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
      />
      <span
        onClick={toggleShow}
        className="cursor-pointer text-gray-400 flex items-center text-base"
      >
        {show ? <EyeOutlined /> : <EyeInvisibleOutlined />}
      </span>
    </div>
  );
};

PasswordField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  toggleShow: PropTypes.func.isRequired,
};

PasswordField.defaultProps = {
  value: "",
};

// ─── ChangePasswordModal Component ───────────
const ChangePasswordModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [ChangePassword] = useChangePasswordMutation()
  const handleSubmit = async () => {
  form
    .validateFields()
    .then(async (values) => {
      const payload = {
        currentPassword: values.oldPassword,
        newPassword: values.newPassword,
      };

      try {
        const res = await ChangePassword(payload).unwrap();
        console.log("Password changed successfully:", res);
        if(res?.success === true){
          form.resetFields();
          onClose();
        }
        form.resetFields();
        onClose();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to change password!");
      }
    })
    .catch((err) => {
      console.log("Validation failed:", err);
    });
};

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={440}
      centered
      styles={{ body: { padding: "32px" } }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span
          onClick={onClose}
          className="cursor-pointer text-lg font-medium text-gray-800"
        >
          ←
        </span>
        <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
      </div>

      <p className="text-gray-500 text-sm mb-6">
        Your password must be 8-10 character long.
      </p>

      <Form form={form} layout="vertical">

        {/* Old Password */}
        <Form.Item
          label="Enter old password"
          name="oldPassword"
          rules={[{ required: true, message: "Please enter old password" }]}
          className="mb-5"
        >
          <PasswordField
            placeholder="Enter old password"
            show={showOld}
            toggleShow={() => setShowOld((prev) => !prev)}
          />
        </Form.Item>

        {/* New Password */}
        <Form.Item
          label="Set new password"
          name="newPassword"
          rules={[
            { required: true, message: "Please enter new password" },
            { min: 8, max: 10, message: "Password must be 8-10 characters" },
          ]}
          className="mb-5"
        >
          <PasswordField
            placeholder="Set new password"
            show={showNew}
            toggleShow={() => setShowNew((prev) => !prev)}
          />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          label="Re-enter new password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
          className="mb-2"
        >
          <PasswordField
            placeholder="Re-enter new password"
            show={showConfirm}
            toggleShow={() => setShowConfirm((prev) => !prev)}
          />
        </Form.Item>

        {/* Forget Password */}
        <div className="my-3">
          <Link to="/auth/forget-password">
  <span className="text-[#0f3d2e] text-sm cursor-pointer hover:underline">
    Forget password?
  </span>
</Link>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-[#0f3d2e] hover:bg-[#0a2e21] text-white font-semibold text-base transition-colors"
        >
          Update password
        </button>

      </Form>
    </Modal>
  );
};

ChangePasswordModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

// ─── PersonalInformation Component ───────────
const PersonalInformation = () => {
  const { data, refetch } = useGetUserQuery();
  const user = data?.data;

   const userProfilePhoto = user?.avatarUrl
    ? `${imageBaseUrl}${user.avatarUrl}`
    : profile;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "";

  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      refetch()
      form.setFieldsValue({
        fullName,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, form, fullName]);

  return (
    <div className="w-full bg-gray-50 py-6">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Link to="/">
          <IoChevronBack className="text-2xl" />
        </Link>
        <h1 className="text-2xl font-semibold">Personal Information</h1>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex gap-10">

        {/* LEFT SIDE */}
        <div className="w-[260px] flex flex-col items-center text-center">
          <img
            src={userProfilePhoto}
            crossOrigin="anonymous"
            alt="profile"
            className="w-40 h-40 rounded-2xl object-cover"
          />
          <h2 className="mt-3 font-semibold text-lg">
            {fullName || "User Name"}
          </h2>
          <p className="text-gray-500 text-sm uppercase">{user?.role}</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1">
          <Form form={form} layout="vertical" className="space-y-4">

            <Form.Item label="Full Name" name="fullName">
              <CustomInput disabled className="bg-[#f1f3f2]" />
            </Form.Item>

            <Form.Item label="Email Address" name="email">
              <CustomInput disabled className="bg-[#f1f3f2]" />
            </Form.Item>

            <Form.Item label="Phone Number" name="phone">
              <CustomInput disabled className="bg-[#f1f3f2]" />
            </Form.Item>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 rounded-lg bg-[#E8F3EF] text-[#0f3d2e] font-medium hover:bg-[#d4eae0] transition-colors"
              >
                Change Password
              </button>

              <Link to="/edit-personal-info">
                <button className="px-6 py-2 rounded-lg bg-[#0f3d2e] text-white font-medium hover:bg-[#0a2e21] transition-colors">
                  Edit Profile
                </button>
              </Link>
            </div>

          </Form>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
};

export default PersonalInformation;