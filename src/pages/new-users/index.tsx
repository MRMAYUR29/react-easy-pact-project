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
     useLazyGetAllCitiesQuery,
     useLazyGetCountriesQuery,
} from "../../redux/api";
import { useEffect } from "react";
import { useAppDispatch } from "../../redux";
import { UserValidation } from "../../validation";

export const NewUserPage = () => {
     const dispatch = useAppDispatch();
     const navigate = useNavigate();
     const { role } = useAppSlice();
     const { geoGraphics, selectedGeoGraphics } = useUserSlice();
     const { data: roles } = useGetAllUserTypeQuery({});
     const { data: regions } = useGetAllRegionQuery();
     const [GetCountry, { data: countries }] = useLazyGetCountriesQuery();
     const [GetCities, { data: cities }] = useLazyGetAllCitiesQuery();
     const [NewUser, { isLoading, isError, error, data, isSuccess }] =
          useCreateUserMutation();

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
          if (isSuccess) {
               dispatch(handleAppSuccess(data?.message));
               navigate("/users", { replace: true });
          }
     }, [isSuccess, navigate, dispatch, data?.message]);

     const handleSubmit = async (props: IUserProps) => {
          if (props.region_id._id === "") {
               return dispatch(handleAppError("Please select region"));
          } else if (props.country_id._id === "") {
               return dispatch(handleAppError("Please select country"));
          } else if (props.city_id._id === "") {
               return dispatch(handleAppError("Please select city"));
          } else {
               await NewUser({
                    ...props,
               });
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
                         initialValues={{} as IUserProps}
                         validationSchema={UserValidation}
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
                              console.log(errors);
                              return (
                                   <form onSubmit={handleSubmit}>
                                        <div className="my-10 space-y-5">
                                             {roles?.data &&
                                                  role === "admin" && (
                                                       <AppSelect
                                                            selectLabel="Role"
                                                            value={
                                                                 values
                                                                      .user_type_id
                                                                      ?._id
                                                            }
                                                            onChange={(e) =>
                                                                 setFieldValue(
                                                                      "user_type_id",
                                                                      e.target
                                                                           .value
                                                                 )
                                                            }
                                                            error={
                                                                 errors
                                                                      .user_type_id
                                                                      ?.type_name as string
                                                            }
                                                            touched={
                                                                 touched
                                                                      .user_type_id
                                                                      ?.type_name as boolean
                                                            }
                                                            options={
                                                                 roles?.data.map(
                                                                      (
                                                                           prop
                                                                      ) => {
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
                                                  value={values.name}
                                                  onChange={(e) => {
                                                       const onlyLetters =
                                                            e.target.value.replace(
                                                                 /[^A-Za-z\s]/g,
                                                                 ""
                                                            );
                                                       // Manually set the value (Formik way)
                                                       setFieldValue(
                                                            "name",
                                                            onlyLetters
                                                       );
                                                  }}
                                                  onBlur={handleBlur("name")}
                                                  touched={touched.name}
                                                  error={errors.name}
                                                  label="Enter full name"
                                                  placeholder="Enter full name"
                                             />
                                             <AppInput
                                                  type="text" // use text instead of number
                                                  value={values.mobile}
                                                  onChange={(e) => {
                                                       const value =
                                                            e.target.value.replace(
                                                                 /\D/g,
                                                                 ""
                                                            ); // allow only digits
                                                       if (value.length <= 10) {
                                                            handleChange(
                                                                 "mobile"
                                                            )(value);
                                                       }
                                                  }}
                                                  onBlur={handleBlur("mobile")}
                                                  touched={touched.mobile}
                                                  error={errors.mobile}
                                                  label="mobile number"
                                                  placeholder="Enter mobile number"
                                                  prefix="+91"
                                             />
                                             <AppInput
                                                  value={values.email}
                                                  onChange={handleChange(
                                                       "email"
                                                  )}
                                                  onBlur={handleBlur("email")}
                                                  touched={touched.email}
                                                  error={errors.email}
                                                  label="email address"
                                                  type="email"
                                                  placeholder="Enter email address"
                                             />
                                             <div className="flex items-center gap-3">
                                                  <AppInput
                                                       value={values.password}
                                                       onChange={handleChange(
                                                            "password"
                                                       )}
                                                       onBlur={handleBlur(
                                                            "password"
                                                       )}
                                                       touched={
                                                            touched.password
                                                       }
                                                       error={errors.password}
                                                       label="create password"
                                                       type="password"
                                                       placeholder="Enter password"
                                                  />
                                             </div>
                                             <div className="flex items-center gap-3">
                                                  <AppInput
                                                       value={values.department}
                                                       onChange={handleChange(
                                                            "department"
                                                       )}
                                                       onBlur={handleBlur(
                                                            "department"
                                                       )}
                                                       touched={
                                                            touched.department
                                                       }
                                                       error={errors.department}
                                                       label="department"
                                                       placeholder="Enter department"
                                                  />
                                                  <AppInput
                                                       value={
                                                            values.designation
                                                       }
                                                       onChange={handleChange(
                                                            "designation"
                                                       )}
                                                       onBlur={handleBlur(
                                                            "designation"
                                                       )}
                                                       touched={
                                                            touched.designation
                                                       }
                                                       error={
                                                            errors.designation
                                                       }
                                                       label="designation"
                                                       placeholder="Enter designation"
                                                  />
                                             </div>
                                             <div className="flex items-start gap-3">
                                                  <AppSelect
                                                       value={
                                                            values.region_id
                                                                 ?._id
                                                       }
                                                       error={
                                                            errors.region_id
                                                                 ?._id
                                                       }
                                                       touched={
                                                            touched.region_id
                                                                 ?._id
                                                       }
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
                                                       value={
                                                            values.country_id
                                                                 ?._id
                                                       }
                                                       error={
                                                            errors.country_id
                                                                 ?._id
                                                       }
                                                       touched={
                                                            touched.country_id
                                                                 ?._id
                                                       }
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
                                                       value={
                                                            values.city_id?._id
                                                       }
                                                       error={
                                                            errors.city_id?._id
                                                       }
                                                       touched={
                                                            touched.city_id?._id
                                                       }
                                                       onChange={(e) => {
                                                            const selectedCityId =
                                                                 e.target.value;
                                                            setFieldValue(
                                                                 "city_id._id",
                                                                 selectedCityId
                                                            );
                                                            dispatch(
                                                                 setSelectedGeoGraphics(
                                                                      {
                                                                           ...selectedGeoGraphics,
                                                                           city: selectedCityId,
                                                                      }
                                                                 )
                                                            );
                                                       }}
                                                       selectLabel="City"
                                                       options={
                                                            cities?.data?.map(
                                                                 (prop) => ({
                                                                      label: prop.name,
                                                                      value: prop._id,
                                                                 })
                                                            ) as []
                                                       }
                                                  />
                                             </div>
                                        </div>
                                        <div className="flex items-center gap-5 justify-end mt-10">
                                             <AppButton
                                                  type="button"
                                                  black
                                                  onClick={() => navigate(-1)}
                                             >
                                                  Cancel
                                             </AppButton>
                                             <AppButton
                                                  type="submit"
                                                  loading={isLoading}
                                             >
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
