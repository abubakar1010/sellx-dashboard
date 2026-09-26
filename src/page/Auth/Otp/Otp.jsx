import logo from "/logo/logo.png";
import { useNavigate, useParams } from "react-router-dom";
import OTPInput from "react-otp-input";
import { useState } from "react";
import CustomButton from "../../../utils/CustomButton";
import {
  useForgotPasswordMutation,
  useVerifyEmailMutation,
} from "../../../redux/features/auth/authApi";
import { toast } from "sonner";
import { loggedUser } from "../../../redux/features/auth/authSlice";
import { useDispatch } from "react-redux";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const { email } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [forgotPassword] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading }] = useVerifyEmailMutation();

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  // ✅ VERIFY OTP
  const handleMatchOtp = async () => {
    if (!email) {
      return toast.error("Email not found");
    }

    if (otp.length !== 6) {
      return toast.error("OTP must be 6 digits");
    }

    try {
      const res = await verifyOtp({ email, otp }).unwrap();
      if(res?.success === true){
        dispatch(
          loggedUser({
            token: res?.data?.tokens?.accessToken,
            refreshToken: res?.data?.tokens?.refreshToken,
            user: res?.data?.user,
          })
        );
        toast.success(res?.message || "OTP verified successfully");
        navigate(`/auth/new-password/${email}`);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Invalid OTP");
    }
  };

  // ✅ RESEND OTP
  const handleResendPassword = async () => {
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res?.message || "OTP sent again");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,_#DEFFF5_-61.52%,_#FFFFFF_100%)] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center">

        {/* LOGO */}
        <img src={logo} alt="logo" className="w-[80px] h-[80px] mb-2" />

        {/* TEXT */}
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Check your email
        </h1>

        <p className="text-sm text-gray-500 text-center mb-8">
          We sent a reset code to <b>{email}</b>
          <br />
          Enter 6 digit OTP
        </p>

        {/* OTP INPUT */}
        <OTPInput
          value={otp}
          onChange={handleOtpChange}
          numInputs={6}
          renderInput={(props) => <input {...props} />}
          containerStyle={{
            display: "flex",
            gap: "10px",
            marginBottom: "30px",
          }}
          inputStyle={{
            width: "52px",
            height: "52px",
            fontSize: "20px",
            fontWeight: "600",
            textAlign: "center",
            border: "1.5px solid #ddd",
            borderRadius: "10px",
            backgroundColor: "#f7f7f7",
            outline: "none",
          }}
        />

        {/* BUTTON (IMPORTANT FIX HERE) */}
        <div onClick={handleMatchOtp}>
          <CustomButton
          loading={isLoading}
          border
          className="w-full mb-4"
        >
          Verify Code
        </CustomButton>
        </div>

        {/* RESEND */}
        <p className="text-sm text-gray-500">
          Didn’t receive code?{" "}
          <button
            onClick={handleResendPassword}
            className="text-green-700 font-semibold hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default Otp;