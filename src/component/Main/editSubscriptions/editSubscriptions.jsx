import { useEffect, useState } from "react";
import {
  FiInfo,
  FiMinus,
  FiPlus,
  FiCreditCard,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  useGetSingleSubscriptionQuery,
  useUpdateSubscriptionMutation,
} from "../../../redux/features/subscriptions/subscriptions";
import { CURRENCY } from "../../../utils/currency";
import PlanLimitsCard, { FieldError } from "../Subscriptions/PlanLimitsCard";
import {
  BILLING_TYPES,
  UNLIMITED_LISTINGS,
  apiErrorMessage,
  apiFieldErrors,
  defaultDurationFor,
  toPlanPayload,
  validatePlan,
} from "../Subscriptions/planForm";

const EditSubscriptions = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading } = useGetSingleSubscriptionQuery(id);

  const [UpdateSubscription, { isLoading: updateLoading }] =
    useUpdateSubscriptionMutation();

  const [isActive, setIsActive] = useState(true);
  const [billingType, setBillingType] = useState("monthly");
  const [features, setFeatures] = useState([""]);
  const [planName, setPlanName] = useState("");
  const [planIcon, setPlanIcon] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0.00");
  const [durationDays, setDurationDays] = useState("");
  const [maxListings, setMaxListings] = useState("");
  const [unlimitedListings, setUnlimitedListings] = useState(false);
  const [listingDurationHours, setListingDurationHours] = useState("");
  const [errors, setErrors] = useState({});

  // DEFAULT VALUES
  useEffect(() => {
    if (data) {
      setPlanName(data?.name || "");
      setPlanIcon(data?.icon || "");
      setDescription(data?.description || "");
      setPrice(data?.price || "0.00");
      setBillingType(data?.billingType || "monthly");
      setIsActive(data?.isActive ?? true);
      setFeatures(data?.features?.length ? data.features : [""]);
      setDurationDays(data?.durationDays != null ? String(data.durationDays) : "");
      setUnlimitedListings(data?.maxListings === UNLIMITED_LISTINGS);
      setMaxListings(
        data?.maxListings != null && data.maxListings !== UNLIMITED_LISTINGS
          ? String(data.maxListings)
          : ""
      );
      setListingDurationHours(
        data?.listingDurationHours != null ? String(data.listingDurationHours) : ""
      );
    }
  }, [data]);

  // Wraps a setter so editing a field clears its error message.
  const withClear = (field, setter) => (value) => {
    setter(value);
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Keep the duration in step with the billing type unless the admin customised it.
  const selectBillingType = (type) => {
    if (
      durationDays === "" ||
      Number(durationDays) === defaultDurationFor(billingType)
    ) {
      setDurationDays(String(defaultDurationFor(type)));
    }
    setBillingType(type);
    setErrors((prev) => ({ ...prev, billingType: undefined, durationDays: undefined }));
  };

  // ADD FEATURE
  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  // REMOVE FEATURE
  const removeFeature = (idx) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  // UPDATE FEATURE
  const updateFeature = (idx, val) => {
    const updated = [...features];
    updated[idx] = val;
    setFeatures(updated);
  };

  // UPDATE SUBSCRIPTION
  const handleUpdateSubscription = async () => {
    const values = {
      name: planName,
      icon: planIcon,
      features,
      description,
      price,
      currency: CURRENCY,
      billingType,
      durationDays,
      maxListings,
      unlimitedListings,
      listingDurationHours,
      isActive,
    };

    const validationErrors = validatePlan(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      const res = await UpdateSubscription({
        id,
        data: toPlanPayload(values),
      }).unwrap();
      if (res?.success === true) {
        toast.success(res?.message || "Subscription updated successfully");
        navigate("/subscriptions");
      }
    } catch (error) {
      setErrors(apiFieldErrors(error));
      toast.error(
        apiErrorMessage(error, "Could not update the plan. Please try again.")
      );
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="px-2 py-5 font-sans">
      <div>
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Subscription Plan
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Configure the tiers and features for your marketplace sellers.
          </p>
        </div>

        <div className="flex gap-5 items-start">
          {/* LEFT COLUMN */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-5">
                <FiInfo className="w-5 h-5 text-indigo-500" />

                <span className="font-semibold text-gray-700 text-sm">
                  Basic Info
                </span>
              </div>

              {/* Plan Name */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Plan Name
                </label>

                <input
                  type="text"
                  value={planName}
                  onChange={(e) => withClear("name", setPlanName)(e.target.value)}
                  placeholder="e.g. Professional Seller"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />

                <FieldError message={errors.name} />
              </div>

              {/* Plan Icon */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Plan Icon
                </label>

                <input
                  type="text"
                  value={planIcon}
                  onChange={(e) => setPlanIcon(e.target.value)}
                  placeholder="Choose a plan icon"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {/* Features */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Plan Features
                </label>

                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) =>
                        updateFeature(idx, e.target.value)
                      }
                      placeholder="e.g. Unlimited item posting"
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />

                    {idx === features.length - 1 ? (
                      <button
                        type="button"
                        onClick={addFeature}
                        className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-gray-300"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-gray-300"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the benefits..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-5">
                <FiCreditCard className="w-5 h-5 text-indigo-500" />

                <span className="font-semibold text-gray-700 text-sm">
                  Pricing & Billing
                </span>
              </div>

              <div className="flex gap-4 mb-4">
                {/* Price */}
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Price
                  </label>

                  <input
                    type="number"
                    value={price}
                    onChange={(e) => withClear("price", setPrice)(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />

                  <FieldError message={errors.price} />
                </div>

                {/* Currency */}
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Currency
                  </label>

                  <div className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500">
                    {CURRENCY}
                  </div>
                </div>
              </div>

              {/* Billing Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Billing Type
                </label>

                <div className="flex rounded-lg border border-gray-200 overflow-hidden w-fit">
                  {BILLING_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => selectBillingType(type.value)}
                      className={`px-6 py-2 text-sm font-medium ${
                        billingType === type.value
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-white text-gray-500"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                <FieldError message={errors.billingType} />
              </div>
            </div>

            <PlanLimitsCard
              durationDays={durationDays}
              onDurationDaysChange={withClear("durationDays", setDurationDays)}
              maxListings={maxListings}
              onMaxListingsChange={withClear("maxListings", setMaxListings)}
              unlimitedListings={unlimitedListings}
              onUnlimitedListingsChange={withClear("maxListings", setUnlimitedListings)}
              listingDurationHours={listingDurationHours}
              onListingDurationHoursChange={withClear(
                "listingDurationHours",
                setListingDurationHours
              )}
              errors={errors}
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="w-[35%]">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-700 text-sm">
                  Plan Status
                </span>

                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  {isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              {/* TOGGLE */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-gray-700 font-medium">
                  Active
                </span>

                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    isActive ? "bg-indigo-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mb-5">
                Inactive plans will not be visible to customers.
              </p>

              {/* BUTTONS */}
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpdateSubscription}
                  disabled={updateLoading}
                  className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-gray-800 hover:bg-gray-900 rounded-lg"
                >
                  {updateLoading ? "Updating..." : "Update Plan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSubscriptions;