import { Link, useNavigate,  } from "react-router-dom";
import { Form, Checkbox } from "antd";
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import CustomButton from "../../../utils/CustomButton";
import CustomInput from "../../../utils/CustomInput";
import { useLoginMutation } from "../../../redux/features/auth/authApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { loggedUser } from "../../../redux/features/auth/authSlice";
import logo from "/logo/logo.png";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (values) => {
    const { email, password } = values;
    try {
      const res = await login({ email, password });
      if (res.error) {
        toast.error(res.error.data.message);
      }
      if (res?.data?.success === true) {
        dispatch(
          loggedUser({
            token: res?.data?.data?.tokens?.accessToken,
            refreshToken: res?.data?.data?.tokens?.refreshToken,
            user: res?.data?.data?.user,
          })
        );
        toast.success(res.data.message);
        navigate("/");
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
        className="bg-white rounded-2xl shadow-md p-5 w-full"
        style={{ maxWidth: "420px" }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-2">
          <img className="w-[80px] h-[80px]" src={logo} alt="image" />
        </div>

        {/* Heading */}
        <div className="text-center mb-2">
          <h1 className="text-xl font-bold text-gray-900">Login to Account</h1>
          <p className="text-sm text-gray-400 mt-1">
            Please enter your email and password to continue
          </p>
        </div>

        {/* Form */}
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="Email address"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "The input is not a valid email!" },
            ]}
          >
            <CustomInput
              type="email"
              icon={HiOutlineMail}
              placeholder="esteban_schiller@gmail.com"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
            ]}
          >
            <CustomInput
              type="password"
              icon={HiOutlineLockClosed}
              placeholder="••••••••••"
              isPassword
            />
          </Form.Item>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center mb-4">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox >
                <span className="text-sm text-gray-500">Remember Password</span>
              </Checkbox>
            </Form.Item>
            <Link
              to="/auth/forget-password"
              className="text-sm text-gray-700 hover:underline"
            >
              Forget Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <Form.Item>
            <CustomButton
              loading={isLoading}
              className="w-full"
              border={true}
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
              Sign in
            </CustomButton>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;