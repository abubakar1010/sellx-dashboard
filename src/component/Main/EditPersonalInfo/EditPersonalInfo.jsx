import { Form } from "antd";
import { useEffect, useState, useRef } from "react";
import { IoChevronBack } from "react-icons/io5";
import { RiEdit2Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGetUserQuery, useUpdateUserMutation } from "../../../redux/features/profile/profileApi";
import CustomButton from "../../../utils/CustomButton";
import CustomInput from "../../../utils/CustomInput";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import profile from "/logo/profile.jpg";

const EditInformation = () => {
  const { data } = useGetUserQuery();
  const user = data?.data;

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [updateProfileInfo, { isLoading }] = useUpdateUserMutation();

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(profile);
  const fileInputRef = useRef(null);

  // Sync form fields when user data loads
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
      });
    }
  }, [user, form]);

  // Sync avatar image when user data loads
  useEffect(() => {
    if (user?.avatarUrl) {
      setImageUrl(`${imageBaseUrl}${user.avatarUrl}`);
    }
  }, [user]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const onFinish = async (values) => {
    const formdata = new FormData();
    formdata.append("firstName", values.firstName);
    formdata.append("lastName", values.lastName);
    formdata.append("phone", values.phone);
    formdata.append("bio", values.bio);
    if (imageFile) formdata.append("avatarURL", imageFile);

    try {
      const response = await updateProfileInfo(formdata);
      console.log(response)
      if (response.error) {
        toast.error(response.error.data.message);
        return;
      }
      if (response?.data?.user) {
        toast.success("Profile updated successfully!");
        navigate("/personal-info");
      }
    } catch (error) {
      toast.error("Something went wrong while updating your profile.");
    }
  };

  const fullName = user ? `${user.firstName} ${user.lastName}` : "User Name";

  return (
    <div className="w-full bg-gray-50 py-5">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Link to="/personal-info">
          <IoChevronBack className="text-2xl" />
        </Link>
        <h1 className="text-2xl font-semibold">Edit Information</h1>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex gap-10">

        {/* LEFT SIDE */}
        <div className="w-[260px] flex flex-col items-center text-center">
          <div
            className="relative w-40 h-40 cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={imageUrl}
              crossOrigin="anonymous"
              alt="profile"
              className="w-40 h-40 rounded-2xl object-cover"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-55 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm font-medium">Change Image</p>
            </div>
            {/* Edit badge */}
            <div className="absolute -bottom-2 -right-2 bg-[#FF8133] rounded-full p-1.5 z-10 shadow">
              <RiEdit2Line size={16} className="text-white" />
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <h2 className="mt-5 font-semibold text-lg">{fullName}</h2>
          <p className="text-gray-500 text-sm uppercase">{user?.role}</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1">
          <Form form={form} layout="vertical" onFinish={onFinish} className="">

            <div className="flex space-x-2">
              <Form.Item className="w-[50%]" label="First Name" name="firstName">
              <CustomInput placeholder="Enter your first name" />
            </Form.Item>

            <Form.Item className="w-[50%]" label="Last Name" name="lastName">
              <CustomInput placeholder="Enter your last name" />
            </Form.Item>
            </div>
   
   <div className="flex space-x-2">
    <Form.Item className="w-[50%]" label="Email Address" name="email">
              <CustomInput placeholder="Enter your email" readOnly />
            </Form.Item>

            <Form.Item className="w-[50%]" label="Phone Number" name="phone">
              <CustomInput type="tel" placeholder="Enter your phone number" />
            </Form.Item>

   </div>
            
            <Form.Item label="Bio" name="bio">
              <CustomInput placeholder="Enter your bio" />
            </Form.Item>

            <div className="flex justify-end gap-4 pt-4">
              <CustomButton
                loading={isLoading}
                className="px-6 py-2 rounded-lg bg-[#0f3d2e] text-white font-medium"
              >
                Save & Change
              </CustomButton>
            </div>

          </Form>
        </div>

      </div>
    </div>
  );
};

export default EditInformation;