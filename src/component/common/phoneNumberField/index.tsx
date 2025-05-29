import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneNumberFieldProps {
  label?: string;
  value: string;
  onChange: (value?: string) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  label = "Mobile Number *",
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <PhoneInput
        international
        defaultCountry="IN"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`border ${
          touched && error ? "border-red-500" : "border-gray-400"
        } rounded-lg py-2 px-5 focus:ring-blue-500 focus:border-blue-500`}
      />
      {touched && error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default PhoneNumberField;
