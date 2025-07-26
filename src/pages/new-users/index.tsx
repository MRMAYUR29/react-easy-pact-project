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

interface NewUserPageProps {
  isRegistration?: boolean;
  onRegistrationSuccess?: () => void;
  verifiedEmail?: string;
  verificationToken?: string; // Add verificationToken prop
}

export const NewUserPage = ({
  isRegistration = false,
  onRegistrationSuccess,
  verifiedEmail,
  verificationToken, // Destructure the new prop
}: NewUserPageProps) => {
  const roleTitles: Record<string, string> = {
    admin: "The Maestro",
    regional: "Experience Leader",
    employee: "Virtual Guide",
  };

  const { data: departments } = useGetDepartmentsQuery();
  const { data: designations } = useGetDesignationsQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { role } = useAppSlice();
  const { geoGraphics, selectedGeoGraphics } = useUserSlice();
  const {
    data: roles,
    isError: rolesError,
    error: rolesApiError,
  } = useGetAllUserTypeQuery({});

  if (rolesError) {
    console.log("DEBUG: roles API error details:", rolesApiError);
  }

  const { data: regions } = useGetAllRegionQuery();
  const [GetCountry, { data: countries }] = useLazyGetCountriesQuery();
  const [NewUser, { isLoading, isError, error, data, isSuccess }] =
    useCreateUserMutation();

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
      if (isRegistration && onRegistrationSuccess) {
        onRegistrationSuccess();
      } else if (!isRegistration) {
        navigate("/users");
      }
    }
  }, [
    isSuccess,
    navigate,
    dispatch,
    data,
    isRegistration,
    onRegistrationSuccess,
  ]);

  const handleSubmit = async (
    values: IUserProps,
    { resetForm }: { resetForm: () => void }
  ) => {
    console.log("NewUserPage handleSubmit called!", values);
    try {
      if (!verificationToken && isRegistration) {
        dispatch(
          handleAppError(
            "Verification token is missing. Please verify your email again."
          )
        );
        return;
      }

      const payload: any = {
        ...values,
        email: isRegistration ? verifiedEmail : values.email,
        region_id: values.region_id._id,
        country_id: values.country_id._id,
        user_type_id: values.user_type_id._id,
        department: values.department,
        designation: values.designation,
        password: values.password,
        confirmPassword: values.confirmPassword,
        seS_id: values.seS_id,
        name: values.name,
      };

      if (isRegistration && verificationToken) {
        payload.verificationToken = verificationToken;
      }

      console.log("Submitting payload:", payload);
      await NewUser(payload).unwrap(); // Use unwrap() to properly handle the promise

      resetForm();
      dispatch(
        setSelectedGeoGraphics({
          country: "",
          region: "",
        })
      );

      if (isRegistration && onRegistrationSuccess) {
        onRegistrationSuccess();
      }
    } catch (err) {
      console.error("Registration error:", err);
      dispatch(handleAppError("Registration failed. Please try again."));
    }
  };

  return (
    <div className={isRegistration ? "w-full" : "space-y-5"}>
      <div
        className={
          isRegistration
            ? "w-full"
            : "bg-gray-100 p-5 mx-auto w-[80%] rounded-lg"
        }
      >
        {!isRegistration && (
          <PageTitle
            title="New User"
            subTitle="Fill up the form to create new user"
          />
        )}

        <Formik
          enableReinitialize
          initialValues={{
            name: "",
            seS_id: "",
            email: isRegistration && verifiedEmail ? verifiedEmail : "",
            password: "",
            confirmPassword: "",
            region_id: { _id: "" },
            country_id: { _id: "" },
            user_type_id: { _id: "", type_name: "" },
            is_active: false,
            isApproved: false,
            department: "",
            designation: "",
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
            // Add these logs
            console.log("Formik values:", values);
            console.log("Formik errors:", errors);
            console.log("Formik touched:", touched);
            useEffect(() => {
              if (isRegistration && roles?.data) {
                const employeeRole = roles.data.find(
                  (r) => r.type_name === "employee"
                );

                console.log("Available Roles:", roles.data);
                console.log("Employee Role Found:", employeeRole);

                if (employeeRole) {
                  if (
                    values.user_type_id._id === "" ||
                    values.user_type_id.type_name !== "employee"
                  ) {
                    setFieldValue("user_type_id", {
                      _id: employeeRole._id!,
                      type_name: employeeRole.type_name,
                    });
                  }
                } else {
                  console.error(
                    "Error: 'employee' user type not found in roles data."
                  );
                  dispatch(
                    handleAppError(
                      "System configuration error: Employee role definition missing."
                    )
                  );
                }
              }
            }, [
              isRegistration,
              roles,
              setFieldValue,
              values.user_type_id._id,
              values.user_type_id.type_name,
              dispatch,
            ]);

            return (
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="space-y-5">
                  {/* Role Field - Hidden for registration */}
                  {!isRegistration && roles?.data && role === "admin" && (
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

                  {/* Name and SESA ID */}
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

                  {/* Email (only shown for admin, not during registration) */}
                  {!isRegistration && (
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
                  )}

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
                            country: "",
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
                  {!isRegistration && (
                    <AppButton type="button" black onClick={() => navigate(-1)}>
                      Cancel
                    </AppButton>
                  )}
                  <AppButton type="submit" loading={isLoading}>
                    {isRegistration ? "Register" : "Submit"}
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
