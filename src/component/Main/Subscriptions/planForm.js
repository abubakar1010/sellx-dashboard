// Shared form logic for the add/edit subscription plan pages.
// Rules mirror the backend's subscription.validation.ts so admins see problems before saving.

export const BILLING_TYPES = [
  { value: "monthly", label: "Monthly", defaultDurationDays: 30 },
  { value: "weekly", label: "Weekly", defaultDurationDays: 7 },
];

export const UNLIMITED_LISTINGS = -1;

export const defaultDurationFor = (billingType) =>
  BILLING_TYPES.find((type) => type.value === billingType)?.defaultDurationDays ?? 30;

const isBlank = (value) => value === undefined || value === null || String(value).trim() === "";

const wholeNumber = (value) => Number.isInteger(Number(value));

// Returns { field: message } for every invalid field; empty object when the form is valid.
export const validatePlan = ({
  name,
  price,
  billingType,
  durationDays,
  maxListings,
  unlimitedListings,
  listingDurationHours,
}) => {
  const errors = {};

  if (name.trim().length < 2) {
    errors.name = "Plan name must be at least 2 characters.";
  }

  if (isBlank(price)) {
    errors.price = "Price is required.";
  } else if (Number.isNaN(Number(price)) || Number(price) < 0) {
    errors.price = "Price must be 0 or more.";
  }

  if (!BILLING_TYPES.some((type) => type.value === billingType)) {
    errors.billingType = "Choose a billing type.";
  }

  if (isBlank(durationDays)) {
    errors.durationDays = "Plan duration is required.";
  } else if (!wholeNumber(durationDays) || Number(durationDays) < 1) {
    errors.durationDays = "Plan duration must be a whole number of at least 1 day.";
  }

  if (!unlimitedListings) {
    if (isBlank(maxListings)) {
      errors.maxListings = "Enter how many listings this plan allows, or choose unlimited.";
    } else if (!wholeNumber(maxListings) || Number(maxListings) < 1) {
      errors.maxListings = "Max listings must be a whole number of at least 1.";
    }
  }

  if (isBlank(listingDurationHours)) {
    errors.listingDurationHours = "Listing duration is required.";
  } else if (!wholeNumber(listingDurationHours) || Number(listingDurationHours) < 1) {
    errors.listingDurationHours = "Listing duration must be a whole number of at least 1 hour.";
  }

  return errors;
};

export const toPlanPayload = ({
  name,
  icon,
  features,
  description,
  price,
  currency,
  billingType,
  durationDays,
  maxListings,
  unlimitedListings,
  listingDurationHours,
  isActive,
}) => ({
  name: name.trim(),
  icon,
  features: features.map((item) => item.trim()).filter(Boolean),
  description,
  price: Number(price),
  currency,
  billingType,
  durationDays: Number(durationDays),
  maxListings: unlimitedListings ? UNLIMITED_LISTINGS : Number(maxListings),
  listingDurationHours: Number(listingDurationHours),
  isActive,
});

// Turns the API's { errors: [{ field, message }] } into { field: message } for inline display.
export const apiFieldErrors = (error) =>
  Object.fromEntries(
    (error?.data?.errors ?? [])
      .filter((item) => item?.field)
      .map((item) => [item.field, item.message])
  );

export const apiErrorMessage = (error, fallback) =>
  error?.data?.message ||
  (error?.status === "FETCH_ERROR"
    ? "Could not reach the server. Check your connection and try again."
    : fallback);
