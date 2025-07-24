// components/UserForm.tsx
import { useEffect, useState } from "react";
import { Formik } from "formik";
import { AppButton, AppInput, AppSelect } from "../../component";
import { IUserProps } from "../../interface";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { UserValidation } from "../../validation";
import { setSelectedGeoGraphics } from "../../redux/slice"; // Import setSelectedGeoGraphics

// Add AppDispatch type if you have it, otherwise 'any' is fine for now
import { AppDispatch } from "../../redux"; // Assuming this path

interface UserFormProps {
  initialValues: IUserProps;
  onSubmit: (values: IUserProps) => void;
  isLoading?: boolean;
  isEdit?: boolean;
  roles?: any; // Consider a more specific type if possible
  regions?: any; // Consider a more specific type if possible: { data: { _id: string; name: string }[] }
  countries?: any; // Consider a more specific type if possible: { data: { _id: string; name: string }[] }
  selectedGeoGraphics?: { country: string; region: string }; // This prop itself is optional
  dispatch?: AppDispatch; // Using AppDispatch for better typing
  onCancel?: () => void;
  role?: string | null;
}

export const UserForm = ({
  initialValues,
  onSubmit,
  isLoading,
  isEdit = false,
  roles,
  regions,
  countries,
  selectedGeoGraphics, // Now receiving this prop
  dispatch,
  onCancel,
  role,
}: UserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const roleTitles: Record<string, string> = {
    admin: "The Maestro",
    regional: "Experience Leader",
    employee: "Virtual Guide",
  };

  // Effect to set initial region and country when component mounts for editing
  // In UserForm component
  useEffect(() => {
    if (isEdit && initialValues) {
      // Only dispatch if values are different from current Redux state
      const currentRegion = selectedGeoGraphics?.region || "";
      const currentCountry = selectedGeoGraphics?.country || "";

      const regionId =
        typeof initialValues.region_id === "string"
          ? initialValues.region_id
          : initialValues.region_id?._id || "";

      const countryId =
        typeof initialValues.country_id === "string"
          ? initialValues.country_id
          : initialValues.country_id?._id || "";

      if (regionId !== currentRegion || countryId !== currentCountry) {
        console.log("Dispatching new geographic values");
        dispatch?.(
          setSelectedGeoGraphics({
            region: regionId,
            country: countryId,
          })
        );
      }
    }
  }, [isEdit, initialValues]); // Only depend on these values

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={!isEdit ? UserValidation : undefined}
      onSubmit={onSubmit}
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
      }) => (
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
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

            <AppInput
              value={values.name}
              onChange={(e) => {
                const onlyLetters = e.target.value.replace(/[^A-Za-z\s]/g, "");
                setFieldValue("name", onlyLetters);
              }}
              onBlur={handleBlur("name")}
              touched={touched.name}
              error={errors.name}
              label="Full name *"
              placeholder="Enter full name"
            />

            <AppInput
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              touched={touched.email}
              error={errors.email}
              label="Email address *"
              type="email"
              placeholder="Enter email address"
            />

            {!isEdit && (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <AppInput
                      value={values.password}
                      onChange={handleChange("password")}
                      onBlur={handleBlur("password")}
                      touched={touched.password}
                      error={errors.password}
                      label="Create password *"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
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
                      label="Confirm password *"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
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
              </>
            )}

            <div className="flex items-center gap-3">
              <AppInput
                value={values.department}
                onChange={handleChange("department")}
                onBlur={handleBlur("department")}
                touched={touched.department}
                error={errors.department}
                label="Department *"
                placeholder="Enter department"
              />
              <AppInput
                value={values.designation}
                onChange={handleChange("designation")}
                onBlur={handleBlur("designation")}
                touched={touched.designation}
                error={errors.designation}
                label="Designation *"
                placeholder="Enter designation"
              />
            </div>

            <div className="flex items-start gap-3">
              <AppSelect
                value={selectedGeoGraphics?.region || ""}
                error={errors.region_id?._id}
                touched={touched.region_id?._id}
                onChange={(e) => {
                  const newRegionId = e.target.value;
                  setFieldValue("region_id._id", newRegionId);
                  setFieldValue("country_id._id", ""); // Reset country in formik values
                  dispatch?.(
                    setSelectedGeoGraphics({
                      region: newRegionId,
                      country: "", // Explicitly set country to empty string
                    })
                  );
                }}
                selectLabel="Region *"
                options={
                  regions?.data?.map((prop: any) => ({
                    label: prop.name,
                    value: prop._id,
                  })) || []
                }
              />
              <AppSelect
                value={selectedGeoGraphics?.country || ""}
                error={errors.country_id?._id}
                touched={touched.country_id?._id}
                onChange={(e) => {
                  const newCountryId = e.target.value;
                  setFieldValue("country_id._id", newCountryId);

                  // FIX: Use current selected region or default to empty string
                  const currentRegion = selectedGeoGraphics?.region || "";

                  dispatch?.(
                    setSelectedGeoGraphics({
                      region: currentRegion, // Ensure region is always a string
                      country: newCountryId,
                    })
                  );
                }}
                selectLabel="Country *"
                options={
                  countries?.data?.map((prop: any) => ({
                    label: prop.name,
                    value: prop._id,
                  })) || []
                }
                disabled={!selectedGeoGraphics?.region} // Disable if no region is selected
              />
            </div>

            <div className="flex items-center gap-5 justify-end pt-5">
              <AppButton type="button" onClick={onCancel}>
                Cancel
              </AppButton>
              <AppButton type="submit" loading={isLoading}>
                {isEdit ? "Update User" : "Create User"}
              </AppButton>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};
