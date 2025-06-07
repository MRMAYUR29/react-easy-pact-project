// src/pages/ResetPasswordPage.tsx
import { Formik } from "formik";
import { object, string, ref } from "yup"; // Import 'ref' for confirm password validation
import { AppInput, AppButton } from "../../component"; // Adjust path if necessary
import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { FaEyeLowVision, FaRegEye } from "react-icons/fa6"; // For password visibility toggle
import { useResetPasswordMutation } from "../../redux/api"; // We'll define this mutation soon

// 1. Define the validation schema for new password and confirm password
const resetPasswordValidationSchema = object({
  password: string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one digit")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  confirmPassword: string()
    .required("Confirm password is required")
    .oneOf([ref("password")], "Passwords must match"), // 'ref("password")' refers to the value of the 'password' field
});

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams(); // Hook to get URL query parameters
  const navigate = useNavigate(); // Hook for navigation
  const token = searchParams.get("token"); // Get the token from the URL (e.g., ?token=abc)

  const [resetPassword, { isLoading }] = useResetPasswordMutation(); // Our new mutation
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // If no token is present in the URL, we might want to redirect or show an error
  if (!token) {
    // You could redirect to login or a generic error page
    // navigate('/sign-in', { replace: true });
    // return null; // Or render a message
    return (
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
           style={{ backgroundImage: "url(/images/background.jpg)" }}>
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 z-0" />
        <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h2>
          <p className="text-gray-700 mb-4">The password reset link is missing or invalid.</p>
          <Link to="/sign-in" className="text-green-700 hover:underline">Back to Login</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // Send the token and new password to your backend
      const res = await resetPassword({ token, password: values.password }).unwrap();
      setSuccessMsg(res.message || "Your password has been reset successfully. You can now log in.");
      // Optionally redirect to login after a delay
      setTimeout(() => {
        navigate("/sign-in");
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url(/images/background.jpg)" }}
    >
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 z-0" />

      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-4">Set New Password</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Enter your new password below.
        </p>

        {successMsg && <p className="text-green-600 text-sm text-center mb-2">{successMsg}</p>}
        {errorMsg && <p className="text-red-600 text-sm text-center mb-2">{errorMsg}</p>}

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={resetPasswordValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleBlur, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password Input */}
              <div className="relative">
                <AppInput
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password")}
                  onBlur={handleBlur("password")}
                  touched={touched.password}
                  error={errors.password}
                  placeholder="Enter new password"
                  centered
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEye /> : <FaEyeLowVision />}
                </button>
              </div>

              {/* Confirm New Password Input */}
              <div className="relative">
                <AppInput
                  type={showConfirmPassword ? "text" : "password"}
                  value={values.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  touched={touched.confirmPassword}
                  error={errors.confirmPassword}
                  placeholder="Confirm new password"
                  centered
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaRegEye /> : <FaEyeLowVision />}
                </button>
              </div>

              <AppButton type="submit" loading={isLoading} fullWidth>
                Reset Password
              </AppButton>

              <div className="text-sm text-center">
                <Link to="/sign-in" className="text-green-700 hover:underline">Back to Login</Link>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};