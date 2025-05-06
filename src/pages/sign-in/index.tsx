import { Link, useNavigate } from "react-router-dom";
import { AppButton, AppInput } from "../../component";
import { Formik } from "formik";
import { useAppDispatch } from "../../redux";
import { handleAppError, setToken, useAppSlice } from "../../redux/slice";
import React, { useEffect } from "react";
import { signInValidationSchema } from "../../validation";
import { useLoginMutation } from "../../redux/api";
import { FaEyeLowVision } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";

export const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token, role, appError } = useAppSlice();
  const [Login, { isLoading, isError, error, isSuccess, data }] =
    useLoginMutation();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        setToken({
          role: data.data.user.user_type_id.type_name,
          token: data.data.token,
          user: data.data.user,
        })
      );
      dispatch(handleAppError(null));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) {
      const err = error as {
        data?: { message: string };
        message: string;
      };
      if (err.data) {
        dispatch(handleAppError(err.data.message));
      } else {
        dispatch(handleAppError(err.message));
      }
    }
  }, [dispatch, isError, error]);

  useEffect(() => {
    if (token && role) {
      navigate("/", { replace: true });
    }
  }, [token, role, navigate]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    await Login({
      deviceType: "desktop",
      email: values.email,
      password: values.password,
      lat: 0,
      log: 0,
    });
  };

  return (
    <div
      className="flex items-center justify-center relative h-screen z-50"
      style={{
        backgroundImage: "url(/images/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundBlendMode: "color",
      }}
    >
      <div className="absolute w-full h-full bg-gray-900 bg-opacity-50 z-10" />
      <div className="xl:lg:w-[30%] w-[70%] shadow-lg p-10 rounded-lg z-50 bg-[#CBFEC7A3] bg-opacity-70">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={signInValidationSchema}
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
            <form
              onSubmit={handleSubmit}
              className="space-y-5 flex justify-center items-center z-50 flex-col"
            >
              <img src="/images/logo.jpeg" className="rounded-lg" alt="logo" />
              <h5 className="text-center text-xl font-bold">Login</h5>
              {appError && <p className="text-red-600">{appError}</p>}
              <AppInput
                type="email"
                value={values.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                touched={touched.email}
                error={errors.email}
                label=""
                centered
                placeholder="Enter an email address"
              />
              <div className="relative w-full">
                <AppInput
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password")}
                  onBlur={handleBlur("password")}
                  touched={touched.password}
                  error={errors.password}
                  label=""
                  centered
                  placeholder="Your 6 characters password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {!showPassword ? (
                    <FaEyeLowVision className="size-4" />
                  ) : (
                    <FaRegEye className="size-4" />
                  )}
                </button>
              </div>
              <div className="w-1/2">
                <AppButton fullWidth type="submit" loading={isLoading}>
                  Login
                </AppButton>
              </div>
              <Link to="/help-desk">Need Help?</Link>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};
