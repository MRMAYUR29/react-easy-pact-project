import { useState } from "react";
import { Formik } from "formik";
import { AppButton, AppInput, AppSelect, PageTitle } from "../../component";
import { Modal } from "../../component/UI/newModal";
import {
  setSelectedGeoGraphics,
  useAppSlice,
  useUserSlice,
} from "../../redux/slice";
import { IUserProps } from "../../interface";
import {
  useGetAllRegionQuery,
  useGetAllUserTypeQuery,
  useLazyGetAllCitiesQuery,
  useLazyGetCountriesQuery,
} from "../../redux/api";
import { useAppDispatch } from "../../redux";
import { useEffect } from "react";

export const ProfilePage = () => {
  const { data: regions } = useGetAllRegionQuery();
  const [GetCountry, { data: countries }] = useLazyGetCountriesQuery();
  const [GetCities, { data: cities }] = useLazyGetAllCitiesQuery();
  const { data: roles } = useGetAllUserTypeQuery({});
  const [editModalOpen, setEditModalOpen] = useState(false);

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

  const handleSubmit = (props: IUserProps) => {
    console.log("Profile updated:", props);
    setEditModalOpen(false);
    // Here you would typically dispatch an action to update the profile
  };

  // Get user initials for avatar
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
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
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
            <DetailItem
              label="Mobile"
              value={appUser?.mobile || "-"}
              icon="📱"
            />
            <DetailItem
              label="Location"
              value={[
                appUser?.city_id?.name,
                appUser?.country_id?.name,
                appUser?.region_id?.name,
              ]
                .filter(Boolean)
                .join(", ")}
              icon="📍"
            />
          </div>
          <div className="space-y-4">
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
              mobile: appUser?.mobile || "",
              name: appUser?.name || "",
              user_type_id: appUser?.user_type_id || "",
              password: "",
              department: appUser?.department || "",
              designation: appUser?.designation || "",
              city_id: appUser?.city_id || "",
              country_id: appUser?.country_id || "",
              region_id: appUser?.region_id || "",
            } as IUserProps
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
                            label:
                              prop.type_name.charAt(0).toUpperCase() +
                              prop.type_name.slice(1),
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

                  <AppInput
                    type="number"
                    value={values.mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) {
                        handleChange("mobile")(e);
                      }
                    }}
                    onBlur={handleBlur("mobile")}
                    touched={touched.mobile}
                    error={errors.mobile}
                    label="Mobile number"
                    placeholder="Enter mobile number"
                  />

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

                  <AppSelect
                    value={values.region_id?._id}
                    onChange={(e) => {
                      setFieldValue("region_id._id", e.target.value);
                      dispatch(
                        setSelectedGeoGraphics({
                          ...selectedGeoGraphics,
                          region: e.target.value,
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
                      setFieldValue("country_id._id", e.target.value);
                      dispatch(
                        setSelectedGeoGraphics({
                          ...selectedGeoGraphics,
                          country: e.target.value,
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
          isActive ? "text-green-500 font-medium" : "text-gray-900"
        }`}
      >
        {value || "-"}
      </p>
    </div>
  </div>
);
