import { Formik } from "formik";
import { AppButton, AppInput, AppSelect, PageTitle } from "../../component";
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
          console.log(props);
     };
     return (
          <div>
               <PageTitle title="Profile" subTitle="Manage your profile" />
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
                              <form onSubmit={handleSubmit}>
                                   <div className="my-10 space-y-5">
                                        {roles?.data && role === "admin" && (
                                             <AppSelect
                                                  disabled
                                                  selectLabel="Role"
                                                  value={
                                                       values.user_type_id?._id
                                                  }
                                                  onChange={(e) =>
                                                       setFieldValue(
                                                            "user_type_id",
                                                            e.target.value
                                                       )
                                                  }
                                                  error={
                                                       errors.user_type_id
                                                            ?.type_name as string
                                                  }
                                                  touched={
                                                       touched.user_type_id
                                                            ?.type_name as boolean
                                                  }
                                                  options={
                                                       roles?.data.map(
                                                            (prop) => {
                                                                 return {
                                                                      label:
                                                                           prop.type_name
                                                                                .charAt(
                                                                                     0
                                                                                )
                                                                                .toUpperCase() +
                                                                           prop.type_name.slice(
                                                                                1
                                                                           ),
                                                                      value: prop._id,
                                                                 };
                                                            }
                                                       ) as {
                                                            label: string;
                                                            value: string;
                                                       }[]
                                                  }
                                             />
                                        )}
                                        <AppInput
                                             disabled
                                             value={values.name}
                                             onChange={handleChange("name")}
                                             onBlur={handleBlur("name")}
                                             touched={touched.name}
                                             error={errors.name}
                                             label="Enter full name"
                                             placeholder="Enter full name"
                                        />
                                        <AppInput
                                             disabled
                                             type="number"
                                             value={values.mobile}
                                             onChange={(e) => {
                                                  const value =
                                                       e.target.value.replace(
                                                            /\D/g,
                                                            ""
                                                       ); // Allow only digits
                                                  if (value.length <= 10) {
                                                       handleChange("mobile")(
                                                            e
                                                       );
                                                  }
                                             }}
                                             onBlur={handleBlur("mobile")}
                                             touched={touched.mobile}
                                             error={errors.mobile}
                                             label="mobile number"
                                             placeholder="Enter mobile number"
                                        />
                                        <AppInput
                                             disabled
                                             value={values.email}
                                             onChange={handleChange("email")}
                                             onBlur={handleBlur("email")}
                                             touched={touched.email}
                                             error={errors.email}
                                             label="email address"
                                             type="email"
                                             placeholder="Enter email address"
                                        />
                                        <div className="flex items-center gap-3">
                                             <AppInput
                                                  disabled
                                                  value={values.department}
                                                  onChange={handleChange(
                                                       "department"
                                                  )}
                                                  onBlur={handleBlur(
                                                       "department"
                                                  )}
                                                  touched={touched.department}
                                                  error={errors.department}
                                                  label="department"
                                                  placeholder="Enter department"
                                             />
                                             <AppInput
                                                  disabled
                                                  value={values.designation}
                                                  onChange={handleChange(
                                                       "designation"
                                                  )}
                                                  onBlur={handleBlur(
                                                       "designation"
                                                  )}
                                                  touched={touched.designation}
                                                  error={errors.designation}
                                                  label="designation"
                                                  placeholder="Enter designation"
                                             />
                                        </div>
                                        <div className="flex items-center gap-3">
                                             <AppSelect
                                                  disabled
                                                  value={values.region_id?._id}
                                                  onChange={(e) => {
                                                       setFieldValue(
                                                            "region_id._id",
                                                            e.target.value
                                                       );
                                                       dispatch(
                                                            setSelectedGeoGraphics(
                                                                 {
                                                                      ...selectedGeoGraphics,
                                                                      region: e
                                                                           .target
                                                                           .value,
                                                                 }
                                                            )
                                                       );
                                                  }}
                                                  selectLabel="Region"
                                                  options={
                                                       regions?.data?.map(
                                                            (prop) => {
                                                                 return {
                                                                      label: prop.name,
                                                                      value: prop._id,
                                                                 };
                                                            }
                                                       ) as []
                                                  }
                                             />
                                             <AppSelect
                                                  disabled
                                                  value={values.country_id?._id}
                                                  onChange={(e) => {
                                                       setFieldValue(
                                                            "country_id._id",
                                                            e.target.value
                                                       );
                                                       dispatch(
                                                            setSelectedGeoGraphics(
                                                                 {
                                                                      ...selectedGeoGraphics,
                                                                      country: e
                                                                           .target
                                                                           .value,
                                                                 }
                                                            )
                                                       );
                                                  }}
                                                  selectLabel="Country"
                                                  options={
                                                       countries?.data?.map(
                                                            (prop) => {
                                                                 return {
                                                                      label: prop.name,
                                                                      value: prop._id,
                                                                 };
                                                            }
                                                       ) as []
                                                  }
                                             />
                                             <AppSelect
                                                  disabled
                                                  value={values.city_id?._id}
                                                  onChange={(e) => {
                                                       setFieldValue(
                                                            "city_id._id",
                                                            e.target.value
                                                       );
                                                       dispatch(
                                                            setSelectedGeoGraphics(
                                                                 {
                                                                      ...selectedGeoGraphics,
                                                                      city: e
                                                                           .target
                                                                           .value,
                                                                 }
                                                            )
                                                       );
                                                  }}
                                                  selectLabel="City"
                                                  options={
                                                       cities?.data?.map(
                                                            (prop) => {
                                                                 return {
                                                                      label: prop.name,
                                                                      value: prop._id,
                                                                 };
                                                            }
                                                       ) as []
                                                  }
                                             />
                                        </div>
                                   </div>
                                   <div className="flex items-center gap-5 justify-end mt-10">
                                        <AppButton type="submit">
                                             Confirm
                                        </AppButton>
                                   </div>
                              </form>
                         );
                    }}
               </Formik>
          </div>
     );
};
