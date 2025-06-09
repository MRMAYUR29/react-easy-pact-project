import { useState } from "react";
import { Formik } from "formik";
import { AppButton, AppInput, AppSelect, PageTitle } from "../../component";
import { Modal } from "../../component/UI/newModal";
import {
  setSelectedGeoGraphics,
  setUserData,
  useAppSlice,
  useUserSlice,
} from "../../redux/slice";
import { IUserProps } from "../../interface";
import {
  useGetAllRegionQuery,
  useGetAllUserTypeQuery,
  useLazyGetAllCitiesQuery,
  useLazyGetCountriesQuery,
  useUpdateUserMutation,
} from "../../redux/api";
import { useAppDispatch } from "../../redux";
import { useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
// import PhoneNumberField from "../../component/common/phoneNumberField";

export const ProfilePage = () => {
  // console.log("appUser (component render):", appUser); // Add this line
  const roleTitles: Record<string, string> = {
    admin: "The Maestro",
    regional: "Experience Leader",
    employee: "Virtual Guide",
  };
  const { data: regions } = useGetAllRegionQuery();
  const [GetCountry, { data: countries }] = useLazyGetCountriesQuery();
  const [GetCities] = useLazyGetAllCitiesQuery();
  const { data: roles } = useGetAllUserTypeQuery({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [updateUser] = useUpdateUserMutation();

  const { appUser, role } = useAppSlice();
  const { geoGraphics, selectedGeoGraphics } = useUserSlice();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedGeoGraphics.region) {
      (async () => {
        await GetCountry(selectedGeoGraphics.region as string);
      })();
    }
  }, [geoGraphics, GetCountry, selectedGeoGraphics.region]);

  useEffect(() => {
    if (selectedGeoGraphics.country && selectedGeoGraphics.region) {
      (async () => {
        await GetCities(selectedGeoGraphics.country as string);
      })();
    }
  }, [
    geoGraphics,
    GetCities,
    selectedGeoGraphics.country,
    selectedGeoGraphics.region,
  ]);

  useEffect(() => {
    console.log("appUser (in useEffect):", appUser); // Add this line
    if (editModalOpen && appUser?.region_id?._id) {
      dispatch(
        setSelectedGeoGraphics({
          region: appUser?.region_id?._id ?? "",
          country: appUser?.country_id?._id ?? "",
        })
      );
    }
  }, [editModalOpen, appUser, dispatch]);

  const handleSubmit = async (props: IUserProps) => {
    try {
      console.log("Submitting with data:", props);
      const id = appUser?._id || "";
  
      // Prepare data excluding _id, only fields you want to update
      const data: Partial<IUserProps> = {
        ...props,
        // These will now correctly be the ILocationProps objects from Formik's values
        user_type_id: props.user_type_id,
        region_id: props.region_id,
        country_id: props.country_id,
      };
  
      console.log("Processed data being sent:", data);
  
      // Remove _id from data as it’s already passed as id separately
      delete (data as any)._id;
  
      const result = await updateUser({ id, data }).unwrap();
      // Create properly typed updated user object by merging original appUser with updated fields
      const updatedUser: IUserProps = {
        ...appUser!, // Non-null assertion since we know appUser exists
        ...data,
        // Ensure all required non-optional fields are present, providing fallbacks if 'data' might not contain them
        seS_id: appUser?.seS_id || "",
        name: props.name || appUser?.name || "",
        email: props.email || appUser?.email || "",
        // The nested objects are now correctly taken from 'data' (i.e., 'props')
        user_type_id: props.user_type_id || appUser?.user_type_id!,
        region_id: props.region_id || appUser?.region_id!,
        country_id: props.country_id || appUser?.country_id!,
        // Add other required fields from IUserProps that might not be in 'props' if they are not editable.
        // For example:
        is_active: props.is_active ?? appUser?.is_active ?? true,
        isApproved: props.isApproved ?? appUser?.isApproved ?? false,
        password: props.password || appUser?.password || "", // If not changing, keep old. Be careful with sensitive data here.
        confirmPassword: props.confirmPassword || "",
        // mobile: props.mobile || appUser?.mobile || "",
      };
  
      // Dispatch action to update user in Redux store
      dispatch(setUserData(updatedUser));
      console.log("API Response:", result);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="profile-container">
      <PageTitle title="Profile" subTitle="View and manage your profile" />

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Profile Header with Avatar */}
        <div className="bg-gray-600 p-6 text-white">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl font-bold">
                {appUser?.name ? getInitials(appUser.name) : "U"}
              </div>
              <div className="absolute bottom-0 right-0 bg-green-400 rounded-full w-6 h-6 border-2 border-white"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{appUser?.name || "User"}</h2>
              <p className="text-blue-100">
                {appUser?.user_type_id?.type_name || "Role"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <DetailItem
              label="SESA ID"
              value={appUser?.seS_id || "-"}
              icon="🆔"
            />
            <DetailItem label="Email" value={appUser?.email || "-"} icon="✉️" />
            {/* <DetailItem
              label="Mobile"
              value={appUser?.mobile || "-"}
              icon="📱"
            /> */}
            <DetailItem
              label="Region"
              value={appUser?.region_id?.name || "Not specified"}
              icon="🌍"
            />
          </div>
          <div className="space-y-4">
            <DetailItem
              label="Country"
              value={appUser?.country_id?.name || "Not specified"}
              icon="🇺🇳"
            />
            <DetailItem
              label="Department"
              value={appUser?.department || "-"}
              icon="🏢"
            />
            <DetailItem
              label="Designation"
              value={appUser?.designation || "-"}
              icon="💼"
            />
            <DetailItem label="Status" value="Active" isActive icon="🟢" />
          </div>
        </div>

        {/* Edit Button */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 text-right">
          <AppButton onClick={() => setEditModalOpen(true)}>
            Edit Profile
          </AppButton>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile"
      >
        <Formik
          enableReinitialize
          initialValues={
            {
              email: appUser?.email || "",
              name: appUser?.name || "",
              password: "",
              department: appUser?.department || "",
              designation: appUser?.designation || "",
              // Initialize region_id and country_id as ILocationProps objects
              region_id: appUser?.region_id || { _id: "", name: "" },
              country_id: appUser?.country_id || { _id: "", name: "" },
              // Initialize user_type_id as the expected object
              user_type_id: appUser?.user_type_id || { _id: "", type_name: "" },
              // Add other properties from IUserProps with appropriate fallbacks
              seS_id: appUser?.seS_id || "",
              confirmPassword: "", // Assuming this is needed for the form but not persisted
              is_active: appUser?.is_active ?? true, // Default to true if not present
              isApproved: appUser?.isApproved ?? false, // Default to false if not present
            } as IUserProps // Cast to IUserProps to ensure type compatibility
          }
          onSubmit={handleSubmit}
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
              <form onSubmit={handleSubmit} className="edit-profile-form">
                <div className="form-grid">
                  {roles?.data && role === "admin" && (
                    <AppSelect
                      selectLabel="Role"
                      value={values.user_type_id?._id}
                      onChange={(e) =>
                        setFieldValue("user_type_id", e.target.value)
                      }
                      error={errors.user_type_id?.type_name as string}
                      touched={touched.user_type_id?.type_name as boolean}
                      options={
                        roles?.data.map((prop) => {
                          return {
                            label: roleTitles[prop.type_name] || prop.type_name,
                            value: prop._id,
                          };
                        }) as {
                          label: string;
                          value: string;
                        }[]
                      }
                    />
                  )}

                  <AppInput
                    value={values.name}
                    onChange={handleChange("name")}
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

                  <div className="relative">
                    <AppInput
                      value={values.password}
                      onChange={handleChange("password")}
                      onBlur={handleBlur("password")}
                      onFocus={() => {
                        console.log("Current password value:", values.password);
                      }}
                      touched={touched.password}
                      error={errors.password}
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setShowPassword(!showPassword);
                        console.log(
                          "Password visibility toggled. Current value:",
                          values.password
                        );
                      }}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>

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

                  {/* <AppSelect
                    value={values.region_id?._id}
                    onChange={(e) => {
                      const regionId = e.target.value || "";
                      setFieldValue("region_id._id", regionId);
                      dispatch(
                        setSelectedGeoGraphics({
                          ...selectedGeoGraphics,
                          region: regionId,
                          country: selectedGeoGraphics.country || "", // fallback to empty string
                          // city: selectedGeoGraphics.city || "",
                        })
                      );
                    }}
                    selectLabel="Region"
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
                    onChange={(e) => {
                      const countryId = e.target.value || "";
                      setFieldValue("country_id._id", countryId);
                      dispatch(
                        setSelectedGeoGraphics({
                          ...selectedGeoGraphics,
                          country: countryId,
                          region: selectedGeoGraphics.region || "",
                          // city: selectedGeoGraphics.city || "",
                        })
                      );
                    }}
                    selectLabel="Country"
                    options={
                      countries?.data?.map((prop) => {
                        return {
                          label: prop.name,
                          value: prop._id,
                        };
                      }) as []
                    }
                  /> */}
                  <AppSelect
                    selectLabel="Region"
                    value={values.region_id?._id} // Bind to the _id of the current region object
                    onChange={(e) => {
                      const selectedRegionId = e.target.value;
                      // Find the full region object from the fetched regions data
                      const selectedRegion = regions?.data?.find(
                        (r) => r._id === selectedRegionId
                      );
                      // Set the entire ILocationProps object for region_id in Formik's state
                      setFieldValue(
                        "region_id",
                        selectedRegion || { _id: "", name: "" }
                      );

                      // Also update selectedGeoGraphics for cascading effects (e.g., fetching countries)
                      dispatch(
                        setSelectedGeoGraphics({
                          region: selectedRegionId,
                          country: "", // Clear country when region changes
                        })
                      );
                      // Crucially, clear the country_id in Formik's values as well when region changes
                      setFieldValue("country_id", { _id: "", name: "" });
                    }}
                    options={
                      regions?.data?.map((prop) => ({
                        label: prop.name || "",
                        value: prop._id || "",
                      })) || []
                    }
                  />

                  <AppSelect
                    selectLabel="Country"
                    value={values.country_id?._id} // Bind to the _id of the current country object
                    onChange={(e) => {
                      const selectedCountryId = e.target.value;
                      // Find the full country object from the fetched countries data
                      const selectedCountry = countries?.data?.find(
                        (c) => c._id === selectedCountryId
                      );
                      // Set the entire ILocationProps object for country_id in Formik's state
                      setFieldValue(
                        "country_id",
                        selectedCountry || { _id: "", name: "" }
                      );

                      // Also update selectedGeoGraphics for cascading effects (e.g., fetching cities if you add them later)
                      dispatch(
                        setSelectedGeoGraphics({
                          ...selectedGeoGraphics, // Keep the region as it is
                          country: selectedCountryId,
                        })
                      );
                    }}
                    options={
                      countries?.data?.map((prop) => ({
                        label: prop.name || "",
                        value: prop._id || "",
                      })) || []
                    }
                  />
                </div>

                <div className="form-actions">
                  <AppButton
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Cancel
                  </AppButton>
                  <AppButton type="submit">Save Changes</AppButton>
                </div>
              </form>
            );
          }}
        </Formik>
      </Modal>
    </div>
  );
};

// Helper component for profile details
const DetailItem = ({
  label,
  value,
  icon,
  isActive,
}: {
  label: string;
  value: string;
  icon?: string;
  isActive?: boolean;
}) => (
  <div className="flex items-start">
    {icon && <span className="mr-3 mt-1">{icon}</span>}
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p
        className={`mt-1 text-sm ${
          isActive ? "text-green-500 font-medium" : "text-[#333333]"
        }`}
      >
        {value || "-"}
      </p>
    </div>
  </div>
);
