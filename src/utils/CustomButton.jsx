/* eslint-disable react/prop-types */
import { Button } from "antd";

const CustomButton = ({
  loading = false,
  children,
  className,
}) => {
  return (
      <div
        className={`${className}   rounded-lg inline-block`}
      >
        <Button
          type="default"
          htmlType="submit"
          loading={loading}
          className="w-full bg-[#0F3D2E] px-5 py-1 flex justify-center items-center gap-5  rounded-lg border-none"
          size="large"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#0F3D2E",
            color: "#FFFFFF", // Ensure text color stays white
          }}
          // Custom hover style to maintain background and text color
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#0F3D2E"; // Maintain the same background color on hover
            e.target.style.color = "#FFFFFF"; // Maintain white text color on hover
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#0F3D2E"; // Maintain the same background color when hover ends
            e.target.style.color = "#FFFFFF"; // Maintain white text color when hover ends
          }}
        >
          {children}
        </Button>
      </div>
  );
};

export default CustomButton;
