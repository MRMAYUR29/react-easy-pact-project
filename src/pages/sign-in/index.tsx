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

  const handleSubmit = async (values: { seS_id: string; password: string }) => {
    await Login({ deviceType: "desktop", seS_id: values.seS_id, password: values.password, lat: 0, log: 0 });
  };

  return (
    <div
  className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center relative"
  style={{ backgroundImage: "url(/images/background.jpg)" }}
>
  {/* Background overlay */}
  <div className="absolute inset-0 bg-gray-900 bg-opacity-50 z-0" />

  {/* Main Login Card */}
  <div className="relative z-10 flex flex-col md:flex-row shadow-xl rounded-lg overflow-hidden w-[95%] max-w-5xl bg-white">
    {/* Left Side */}
    <div className="w-full md:w-1/2 bg-primary-400 text-white flex flex-col justify-center items-center p-6 md:p-10">
      <img
        src="/images/updated_logo-removebg-preview.png"
        className="w-2/3 md:w-3/4 mb-4"
        alt="logo"
      />
      <h1 className="text-xl md:text-2xl font-bold mb-3 text-center">
        Demo Dashboard Portal
      </h1>
    </div>

    {/* Right Side */}
    <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
      <h2 className="text-xl md:text-2xl font-bold mb-5 text-center">
        Enter Your Login Credentials
      </h2>

      <Formik
        initialValues={{ seS_id: "", password: "" }}
        validationSchema={signInValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="space-y-5">
            {appError && <p className="text-red-600">{appError}</p>}

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

            <div className="text-sm text-center flex flex-col gap-2">
              <Link to="/forgot-password" className="text-green-500 hover:underline">
                Forgot Password?
              </Link>
              <Link to="/help-desk" className="text-green-500 hover:underline">
                Need Help?
              </Link>
            </div>
          </form>
        )}
      </Formik>
    </div>
  </div>

  {/* Footer */}
  <div className="mt-4 z-10 text-white text-xs md:text-sm font-semibold text-center px-4">
    © 2025 Schneider Electric. All Rights Reserved.
  </div>
</div>

  );
};
