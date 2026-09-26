import PropTypes from "prop-types";
import { FiSliders } from "react-icons/fi";

const inputClass = (hasError) =>
  `w-full bg-gray-50 border rounded-lg px-3 py-2 text-sm text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50 ${
    hasError
      ? "border-red-300 focus:ring-red-200"
      : "border-gray-200 focus:ring-indigo-300"
  }`;

const labelClass =
  "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1";

export const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-xs text-red-500">{message}</p> : null;

const PlanLimitsCard = ({
  durationDays,
  onDurationDaysChange,
  maxListings,
  onMaxListingsChange,
  unlimitedListings,
  onUnlimitedListingsChange,
  listingDurationHours,
  onListingDurationHoursChange,
  errors,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <div className="flex items-center gap-2 mb-5">
      <FiSliders className="w-5 h-5 text-indigo-500" />

      <span className="font-semibold text-gray-700 text-sm">Plan Limits</span>
    </div>

    <div className="flex flex-col sm:flex-row gap-4">
      {/* Duration */}
      <div className="flex-1">
        <label className={labelClass}>Plan Duration (days)</label>

        <input
          type="number"
          min="1"
          step="1"
          value={durationDays}
          onChange={(e) => onDurationDaysChange(e.target.value)}
          placeholder="e.g. 30"
          className={inputClass(errors.durationDays)}
        />

        <FieldError message={errors.durationDays} />
      </div>

      {/* Listing Duration */}
      <div className="flex-1">
        <label className={labelClass}>Listing Duration (hours)</label>

        <input
          type="number"
          min="1"
          step="1"
          value={listingDurationHours}
          onChange={(e) => onListingDurationHoursChange(e.target.value)}
          placeholder="e.g. 720"
          className={inputClass(errors.listingDurationHours)}
        />

        <p className="mt-1 text-xs text-gray-400">
          How long each listing stays live.
        </p>

        <FieldError message={errors.listingDurationHours} />
      </div>
    </div>

    {/* Max Listings */}
    <div className="mt-4">
      <label className={labelClass}>Max Listings</label>

      <div className="flex items-center gap-4">
        <input
          type="number"
          min="1"
          step="1"
          value={unlimitedListings ? "" : maxListings}
          onChange={(e) => onMaxListingsChange(e.target.value)}
          placeholder={unlimitedListings ? "Unlimited" : "e.g. 10"}
          disabled={unlimitedListings}
          className={`${inputClass(errors.maxListings)} max-w-[200px]`}
        />

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={unlimitedListings}
            onChange={(e) => onUnlimitedListingsChange(e.target.checked)}
            className="accent-indigo-500"
          />
          Unlimited
        </label>
      </div>

      <FieldError message={errors.maxListings} />
    </div>
  </div>
);

FieldError.propTypes = {
  message: PropTypes.string,
};

PlanLimitsCard.propTypes = {
  durationDays: PropTypes.string.isRequired,
  onDurationDaysChange: PropTypes.func.isRequired,
  maxListings: PropTypes.string.isRequired,
  onMaxListingsChange: PropTypes.func.isRequired,
  unlimitedListings: PropTypes.bool.isRequired,
  onUnlimitedListingsChange: PropTypes.func.isRequired,
  listingDurationHours: PropTypes.string.isRequired,
  onListingDurationHoursChange: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    durationDays: PropTypes.string,
    maxListings: PropTypes.string,
    listingDurationHours: PropTypes.string,
  }).isRequired,
};

export default PlanLimitsCard;
