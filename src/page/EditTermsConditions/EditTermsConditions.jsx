import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { Button, Form } from "antd";
import he from "he";

import CustomButton from "../../utils/CustomButton";
import {
  useAddSettingMutation,
  useSettingsQuery,
} from "../../redux/features/setting/settingApi";

const EditTermsConditions = () => {
  const slug = "terms_and_conditions";
  const navigate = useNavigate();

  const { data } = useSettingsQuery({ slug });
  const [updateContent] = useAddSettingMutation();
  const [form] = Form.useForm();

  const [content, setContent] = useState("");

  // ✅ Load API data into editor
  useEffect(() => {
    if (data?.data?.length > 0) {
      const apiContent = data.data[0].content;

      const decoded = he.decode(apiContent || "");

      setContent(decoded);
      form.setFieldsValue({ content: decoded });
    }
  }, [data, form]);

  // ✅ Submit handler
  const handleSubmit = async () => {
    try {
      const payload = {
        slug,
        title: "Terms and Conditions",
        content,
      };

      const res = await updateContent(payload).unwrap();

      if (res?.success === true) {
        navigate("/settings/terms-conditions");
      }
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  return (
    <section className="w-full min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center py-5">
        <div className="flex items-center gap-2">
          <Link to="/settings/terms-conditions">
            <IoChevronBack className="text-2xl" />
          </Link>

          <h1 className="text-2xl font-semibold">
            Edit Terms and Conditions
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="w-full p-6 rounded-lg shadow-md">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="content">
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  [{ font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline", "strike"],
                  [{ align: [] }],
                  [{ color: [] }, { background: [] }],
                  ["blockquote", "code-block"],
                  ["link", "image", "video"],
                  [{ script: "sub" }, { script: "super" }],
                  [{ indent: "-1" }, { indent: "+1" }],
                  ["clean"],
                ],
              }}
              style={{ height: "300px" }}
            />
          </Form.Item>

          {/* Buttons */}
          <div className="w-full flex justify-end gap-3 mt-20">
            <Button
             size="large"
              className="mt-1"
              htmlType="button"
              onClick={() => navigate("/settings/terms-conditions")}
            >
              Cancel
            </Button>

            <CustomButton className="p-1" htmlType="submit">
              Update
            </CustomButton>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default EditTermsConditions;