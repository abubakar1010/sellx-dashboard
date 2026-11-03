import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import CustomButton from "../../utils/CustomButton";
import { useSettingsQuery } from "../../redux/features/setting/settingApi";
import he from "he";
import { useEffect } from "react";

const AboutUsPage = () => {
  const slug = "about_us";

  const { data, isLoading, isError, refetch } = useSettingsQuery({ slug });
  const id = data?.data[0]?._id
  // ✅ array fix
  const rawContent = data?.data?.[0]?.content;

  // ✅ decode HTML
  const content = rawContent ? he.decode(rawContent) : "";

  useEffect(() => {
      refetch();
    }, [refetch]);

  return (
    <section className="w-full min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center py-5 px-5">
        <div className="flex items-center gap-2">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>

          <h1 className="text-2xl font-semibold">
            About Us
          </h1>
        </div>

        <Link to={`/settings/edit-about-us/${id}`}>
          <CustomButton border>
            <TbEdit className="size-5" />
            <span>Edit</span>
          </CustomButton>
        </Link>
      </div>

      {/* Content */}
      <div className="px-5">
        {isLoading && (
          <p className="text-gray-500 text-lg">Loading...</p>
        )}

        {isError && (
          <p className="text-red-500 text-lg">
            Failed to load data
          </p>
        )}

        {!isLoading && !isError && (
          <div
            className="text-lg text-black leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: content || "No content found",
            }}
          />
        )}
      </div>

    </section>
  );
};

export default AboutUsPage;