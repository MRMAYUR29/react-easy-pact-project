import { Formik } from "formik";
import { AppButton, AppInput, AppSelect, PageTitle } from "../../component";
import { IUserProps } from "../../interface/user.interface";
import { useNavigate } from "react-router-dom";
import {
  handleAppError,
  handleAppSuccess,
  setSelectedGeoGraphics,
  useAppSlice,
  useUserSlice,
} from "../../redux/slice";
import {
  useCreateUserMutation,
  useGetAllRegionQuery,
  useGetAllUserTypeQuery,
  useGetDepartmentsQuery,
  useGetDesignationsQuery,
  useLazyGetCountriesQuery,
} from "../../redux/api";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux";
import { UserValidation } from "../../validation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export const NewUserPage = () => {
  const roleTitles: Record<string, string> = {
    admin: "The Maestro",
    regional: "Virtual Guide",
    employee: "Experience Leader",
  };

  const {
    data: departments,
    // refetch: refetchDepartments,
  } = useGetDepartmentsQuery();

  const {
    data: designations,
    // refetch: refetchDesignations,
  } = useGetDesignationsQuery();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { role } = useAppSlice();
  const { geoGraphics, selectedGeoGraphics } = useUserSlice();
  const { data: roles } = useGetAllUserTypeQuery({});
  const { data: regions } = useGetAllRegionQuery();
  const [GetCountry, { data: countries }] = useLazyGetCountriesQuery();
  const [NewUser, { isLoading, isError, error, data, isSuccess }] =
    useCreateUserMutation({
      fixedCacheKey: "create-user",
    });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (selectedGeoGraphics.region) {
      (async () => {
        await GetCountry(selectedGeoGraphics.region as string);
      })();
    }
  }, [geoGraphics, GetCountry, selectedGeoGraphics.region]);

  useEffect(() => {
    if (isSuccess) {
      console.log("Full creation response:", data);
      dispatch(handleAppSuccess(data?.message));
      navigate("/users");
    }
  }, [isSuccess, navigate, dispatch, data]);

  const handleSubmit = async (values: IUserProps) => {
    console.log("Submitting payload:", JSON.stringify(values, null, 2));
    try {
      // Keep the object structure expected by IUserProps
      const payload: IUserProps = {
        ...values,
        //     city_id: values.city_id._id ? { _id: values.city_id._id } : { _id: "" },
        region_id: { _id: values.region_id._id },
        country_id: { _id: values.country_id._id },
        user_type_id: {
          _id: values.user_type_id._id,
          type_name: values.user_type_id.type_name,
        },
      };

      console.log("Submitting payload:", payload);
      const response = await NewUser(payload).unwrap();
      console.log("Registration successful:", response);
    } catch (err) {
      // error handling
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-gray-100 p-5 mx-auto w-[80%] rounded-lg">
        <PageTitle
          title="New User"
          subTitle="Fill up the form to create new user"
        />
        <Formik
          enableReinitialize
          initialValues={{
            name: "",
            seS_id: "",
            mobile: "",
            email: "",
            password: "",
            confirmPassword: "",
            department: "",
            designation: "",
            //   city_id: { _id: "" },
            region_id: { _id: "" },
            country_id: { _id: "" },
            user_type_id: { _id: "", type_name: "" },
            is_active: true,
          }}
          validationSchema={UserValidation}
          onSubmit={handleSubmit}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
          }) => {
            return (
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="my-10 space-y-5">
                  {/* Role Field - First Row */}
                  {roles?.data && role === "admin" && (
                    <AppSelect
                      selectLabel="Role *"
                      value={values.user_type_id?._id}
                      onChange={(e) => {
                        const selectedRole = roles.data.find(
                          (role) => role._id === e.target.value
                        );
                        setFieldValue("user_type_id", {
                          _id: e.target.value,
                          type_name: selectedRole?.type_name || "",
                        });
                      }}
                      error={errors.user_type_id?._id as string}
                      touched={touched.user_type_id?._id as boolean}
                      options={
                        roles?.data.map((prop) => ({
                          label: roleTitles[prop.type_name] || prop.type_name,
                          value: prop._id,
                        })) as { label: string; value: string }[]
                      }
                    />
                  )}

                  {/* Second Row - Full Name and seS_id */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <AppInput
                        value={values.name}
                        onChange={(e) => {
                          const onlyLetters = e.target.value.replace(
                            /[^A-Za-z\s]/g,
                            ""
                          );
                          setFieldValue("name", onlyLetters);
                        }}
                        onBlur={handleBlur("name")}
                        touched={touched.name}
                        error={errors.name}
                        label="Full Name *"
                        placeholder="Enter full name"
                        autoComplete="name"
                      />
                    </div>
                    <div className="flex-1">
                      <AppInput
                        value={values.seS_id}
                        onChange={handleChange("seS_id")}
                        onBlur={handleBlur("seS_id")}
                        touched={touched.seS_id}
                        error={errors.seS_id}
                        label="SESA ID *"
                        placeholder="Enter SESA ID"
                      />
                    </div>
                  </div>

                  {/* Third Row - Mobile and Email */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number *
                      </label>
                      <PhoneInput
                        international
                        defaultCountry="IN"
                        value={values.mobile}
                        onChange={(value) => setFieldValue("mobile", value)}
                        onBlur={handleBlur("mobile")}
                        className={`border ${
                          touched.mobile && errors.mobile
                            ? "border-red-500"
                            : "border-gray-400"
                        } rounded-lg py-2 px-5 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {touched.mobile && errors.mobile && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.mobile}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <AppInput
                        value={values.email}
                        onChange={handleChange("email")}
                        onBlur={handleBlur("email")}
                        touched={touched.email}
                        error={errors.email}
                        label="Email Address *"
                        type="email"
                        placeholder="Enter email address"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Rest of the form remains the same */}
                  {/* Password Fields */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <AppInput
                        value={values.password}
                        onChange={handleChange("password")}
                        onBlur={handleBlur("password")}
                        touched={touched.password}
                        error={errors.password}
                        label="Create Password *"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-10 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    <div className="flex-1 relative">
                      <AppInput
                        value={values.confirmPassword}
                        onChange={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        touched={touched.confirmPassword}
                        error={errors.confirmPassword}
                        label="Confirm Password *"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-10 text-gray-500"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  {/* Department and Designation */}
                  <div className="flex items-center gap-3">
                    <AppSelect
                      value={values.department}
                      error={errors?.department}
                      touched={touched?.department}
                      onChange={handleChange("department")}
                      selectLabel="Department *"
                      options={
                        departments?.map((dept) => ({
                          label: dept,
                          value: dept,
                        })) as []
                      }
                    />

                    <AppSelect
                      value={values.designation}
                      error={errors?.designation}
                      touched={touched?.designation}
                      onChange={handleChange("designation")}
                      selectLabel="Designation *"
                      options={
                        designations?.map((desig) => ({
                          label: desig,
                          value: desig,
                        })) as []
                      }
                    />
                  </div>

                  {/* Region and Country */}
                  <div className="flex items-start gap-3">
                    <AppSelect
                      value={values.region_id?._id}
                      error={errors.region_id?._id}
                      touched={touched.region_id?._id}
                      onChange={(e) => {
                        setFieldValue("region_id._id", e.target.value);
                        dispatch(
                          setSelectedGeoGraphics({
                            ...selectedGeoGraphics,
                            region: e.target.value,
                            country: "", // Reset country when region changes
                          })
                        );
                      }}
                      selectLabel="Region *"
                      options={
                        regions?.data?.map((prop) => {
                          return {
                            label: prop.name,
                            value: prop._id,
                          };
                        }) as []
                      }
                    />
                    <AppSelect
                      value={values.country_id?._id}
                      error={errors.country_id?._id}
                      touched={touched.country_id?._id}
                      onChange={(e) => {
                        setFieldValue("country_id._id", e.target.value);
                        dispatch(
                          setSelectedGeoGraphics({
                            ...selectedGeoGraphics,
                            country: e.target.value,
                          })
                        );
                      }}
                      selectLabel="Country *"
                      options={
                        countries?.data?.map((prop) => {
                          return {
                            label: prop.name,
                            value: prop._id,
                          };
                        }) as []
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-5 justify-end mt-10">
                  <AppButton type="button" black onClick={() => navigate(-1)}>
                    Cancel
                  </AppButton>
                  <AppButton type="submit" loading={isLoading}>
                    Submit
                  </AppButton>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};
