/* eslint-disable react/no-unescaped-entities */
import {  useNavigate } from "react-router-dom";
import { Form } from "antd";
import CustomInput from "../../../utils/CustomInput";
import { HiOutlineMail } from "react-icons/hi";
import CustomButton from "../../../utils/CustomButton";
import { useForgotPasswordMutation } from "../../../redux/features/auth/authApi";
import { toast } from "sonner";
import logo from "/logo/logo.png";
const ForgetPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submit = async (values) => {
    try {
      const res = await forgotPassword(values);
      if (res.error) {
        toast.error(res?.error?.data?.message);
        console.log(res.error);
      }
      if (res.data) {
        toast.success(res.data.message);
        navigate(`/auth/otp/${values?.email}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[linear-gradient(180deg,_#DEFFF5_-61.52%,_#FFFFFF_100%)]"
    >
      <div
        className="bg-white rounded-2xl shadow-sm p-5 w-full"
        style={{ maxWidth: "400px" }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-2">
          <img className="w-[80px] h-[80px]" src={logo} alt="image" />
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold text-gray-900">Forget Password</h1>
          <p className="text-xs text-gray-400 mt-1">
            Please enter your email and code.
          </p>
        </div>

        {/* Form */}
        <Form
          layout="vertical"
          onFinish={submit}
          initialValues={{ email: "" }}
        >
          <Form.Item
            label="Email address"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <CustomInput
              icon={HiOutlineMail}
              placeholder="esteban_schiller@gmail.com"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-2">
            <CustomButton
              loading={isLoading}
              border
              type="submit"
              className="w-full"
              style={{
                backgroundColor: "#1a5c3a",
                borderColor: "#1a5c3a",
                color: "white",
                height: "44px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "15px",
              }}
            >
              Send Code
            </CustomButton>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgetPassword;