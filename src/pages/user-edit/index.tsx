// components/UserForm.tsx
import { useState } from "react";
import { Formik } from "formik";
import { AppButton, AppInput, AppSelect } from "../../component";
import { IUserProps } from "../../interface";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { UserValidation } from "../../validation";
import { setSelectedGeoGraphics } from "../../redux/slice";
// import PhoneNumberField from "../../component/common/phoneNumberField";

interface UserFormProps {
  initialValues: IUserProps;
  onSubmit: (values: IUserProps) => void;
  isLoading?: boolean;
  isEdit?: boolean;
  roles?: any;
  regions?: any;
  countries?: any;
  cities?: any;
  selectedGeoGraphics?: any;
  dispatch?: any;
  onCancel?: () => void;
}

export const UserForm = ({
  initialValues,
  onSubmit,
  isLoading,
  isEdit = false,
  roles,
  regions,
  countries,
  //   cities,
  selectedGeoGraphics,
  dispatch,
  onCancel,
}: UserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const roleTitles: Record<string, string> = {
    admin: "The Maestro",
    regional: "Experience Leader",
    employee: "Virtual Guide",
  };

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
            {roles?.data && (
              <AppSelect
                selectLabel="Role"
                value={values.user_type_id?._id}
                onChange={(e) =>
                  setFieldValue("user_type_id._id", e.target.value)
                }
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
              label="Full name"
              placeholder="Enter full name"
            />
            {/* <PhoneNumberField
              value={values.mobile}
              onChange={(value) => setFieldValue("mobile", value)}
              onBlur={() => handleBlur("mobile")}
              touched={touched.mobile}
              error={errors.mobile}
            /> */}

            <AppInput
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              touched={touched.email}
              error={errors.email}
              label="Email address"
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
                      label="Create password"
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
                      label="Confirm password"
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
                label="Department"
                placeholder="Enter department"
              />
              <AppInput
                value={values.designation}
                onChange={handleChange("designation")}
                onBlur={handleBlur("designation")}
                touched={touched.designation}
                error={errors.designation}
                label="Designation"
                placeholder="Enter designation"
              />
            </div>

            <div className="flex items-start gap-3">
              <AppSelect
                value={values.region_id?._id || ""}
                error={errors.region_id?._id}
                touched={touched.region_id?._id}
                onChange={(e) => {
                  setFieldValue("region_id._id", e.target.value);
                  dispatch?.(
                    setSelectedGeoGraphics({
                      ...selectedGeoGraphics,
                      region: e.target.value,
                    })
                  );
                }}
                selectLabel="Region"
                options={
                  regions?.data?.map((prop: any) => ({
                    label: prop.name,
                    value: prop._id,
                  })) || []
                }
              />
              <AppSelect
                value={values.country_id?._id}
                error={errors.country_id?._id}
                touched={touched.country_id?._id}
                onChange={(e) => {
                  setFieldValue("country_id._id", e.target.value);
                  dispatch?.(
                    setSelectedGeoGraphics({
                      ...selectedGeoGraphics,
                      country: e.target.value,
                    })
                  );
                }}
                selectLabel="Country"
                options={
                  countries?.data?.map((prop: any) => ({
                    label: prop.name,
                    value: prop._id,
                  })) || []
                }
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
