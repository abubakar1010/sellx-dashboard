import { useNavigate } from "react-router-dom";
import { Form } from "antd";
import CustomInput from "../../../utils/CustomInput";
import CustomButton from "../../../utils/CustomButton";
import { toast } from "sonner";
import { useResetPasswordMutation } from "../../../redux/features/auth/authApi";
import logo from "/logo/logo.png";

const NewPassword = () => {
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const submit = async (values) => {
  const { password } = values;
    try {
      const res = await resetPassword({
        isReset: true,
        newPassword: password,
      }).unwrap();
      console.log(res)
      if(res?.success === true){
        toast.success(res.message || "Password updated successfully");
        navigate("/auth");
      }

    } catch (error) {
      console.log(error);
      toast.error(
        error?.data?.message ||
          error?.error ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,_#DEFFF5_-61.52%,_#FFFFFF_100%)] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center">
        
        {/* Logo */}
        <img
          src={logo}
          alt="SellX"
          className="w-[80px] h-[80px]"
        />

        {/* Heading */}
        <h1 className="text-xl font-bold text-gray-900 mb-2 mt-2">
          Set a new password
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Create a new password. Ensure it differs from
          <br />
          previous ones for security.
        </p>

        {/* Form */}
        <Form
          layout="vertical"
          onFinish={submit}
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          className="w-full"
        >
          {/* New Password */}
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your new password",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters",
              },
            ]}
          >
            <CustomInput
              isPassword
              type="password"
              placeholder="Enter new password"
            />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    getFieldValue("password") === value
                  ) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("Passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <CustomInput
              isPassword
              type="password"
              placeholder="Confirm password"
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item className="mb-0 mt-2">
            <CustomButton
              loading={isLoading}
              border
              className="w-full"
            >
              Update Password
            </CustomButton>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default NewPassword;