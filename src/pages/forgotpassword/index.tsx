import { Formik } from "formik";
import { AppInput, AppButton } from "../../component";
import { forgotPasswordValidationSchema } from "../../validation";
import { useForgotPasswordMutation } from "../../redux/api";
import { useState } from "react";
import { Link } from "react-router-dom";
// import { FaEyeLowVision, FaRegEye } from "react-icons/fa6";

export const ForgotPasswordPage = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  // const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: { seS_id: string }) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await forgotPassword(values).unwrap();
      setSuccessMsg(
        res.message ||
          "If a matching SESA ID is found, a password reset link has been sent to your registered email."
      );
    } catch (err: any) {
      setErrorMsg(
        err?.data?.message ||
          err?.message ||
          "Failed to send reset link. Please try again."
      );
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url(/images/background.jpg)" }}
    >
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 z-0" />

      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-4">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Enter your SESA ID to receive a password reset link.
        </p>

        {successMsg && (
          <p className="text-green-600 text-sm text-center mb-2">
            {successMsg}
          </p>
        )}
        {errorMsg && (
          <p className="text-red-600 text-sm text-center mb-2">{errorMsg}</p>
        )}

        <Formik
          initialValues={{ seS_id: "" }}
          validationSchema={forgotPasswordValidationSchema}
          onSubmit={handleSubmit}
        >
          {({
            errors,
            touched,
            values,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-5">
              <AppInput
                type="text"
                value={values.seS_id}
                onChange={handleChange("seS_id")}
                onBlur={handleBlur("seS_id")}
                touched={touched.seS_id}
                error={errors.seS_id}
                placeholder="Enter your SESA ID"
                centered
              />

              {/* <div className="relative">
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
              </div> */}

              <AppButton type="submit" loading={isLoading} fullWidth>
                Send Reset Link
              </AppButton>

              <div className="text-sm text-center">
                <Link to="/sign-in" className="text-green-700 hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};
