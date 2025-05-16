import { Link, useNavigate } from "react-router-dom";
import { AppButton, AppInput } from "../../component";
import { Formik } from "formik";
import { useAppDispatch } from "../../redux";
import { handleAppError, setToken, useAppSlice } from "../../redux/slice";
import { useEffect, useState } from "react";
import { signInValidationSchema } from "../../validation";
import { useLoginMutation } from "../../redux/api";
import { FaEyeLowVision, FaRegEye } from "react-icons/fa6";

export const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token, role, appError } = useAppSlice();
  const [Login, { isLoading, isError, error, isSuccess, data }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setToken({
        role: data.data.user.user_type_id.type_name,
        token: data.data.token,
        user: data.data.user,
      }));
      dispatch(handleAppError(null));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) {
      const err = error as { data?: { message: string }; message: string };
      dispatch(handleAppError(err.data?.message || err.message));
    }
  }, [dispatch, isError, error]);

  useEffect(() => {
    if (token && role) navigate("/", { replace: true });
  }, [token, role, navigate]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    await Login({ deviceType: "desktop", email: values.email, password: values.password, lat: 0, log: 0 });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url(/images/background.jpg)" }}>

      {/* Background overlay */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 z-0" />

      {/* Main Login Card */}
      <div className="relative z-10 flex shadow-xl rounded-lg overflow-hidden w-[90%] max-w-5xl bg-white">
        {/* Left Side */}
        <div className="w-1/2 bg-green-700 text-white flex flex-col justify-center items-center p-10">
          <img src="/images/updated_logo-removebg-preview.png" className="w-2/3 mb-4" alt="logo" />
          <h1 className="text-2xl font-bold text-center">Demo Dashboard Portal</h1>
        </div>

        {/* Right Side */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-green-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-6">Sign in to continue to your dashboard</p>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={signInValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, handleBlur, handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit} className="space-y-5">
                {appError && <p className="text-red-600">{appError}</p>}

                <AppInput
                  type="email"
                  value={values.email}
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                  touched={touched.email}
                  error={errors.email}
                  placeholder="Enter your email"
                  centered
                />

                <div className="relative">
                  <AppInput
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    touched={touched.password}
                    error={errors.password}
                    placeholder="Enter your password"
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

                <AppButton type="submit" loading={isLoading} fullWidth>
                  Login
                </AppButton>

                <div className="text-sm text-center">
                  <Link to="/help-desk" className="text-green-700 hover:underline">Need Help?</Link>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 z-10 text-white text-sm font-semibold text-center">
        © 2018 Schneider Electric. All Rights Reserved.
      </div>
    </div>
  );
};
