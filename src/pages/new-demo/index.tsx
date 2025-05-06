import { Formik, Field } from "formik";
import { AppButton, AppInput, AppSelect, PageTitle } from "../../component";
import { DemoProps } from "../../interface";
import { useCallback, useEffect, useState } from "react";
import { Textarea } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import {
     useCreateNewProductMutation,
     useGetCategoriesQuery,
} from "../../redux/api";
import {
     clearFiles,
     handleAppError,
     handleAppSuccess,
     handleFiles,
     handleFileUrls,
     useProductSlice,
} from "../../redux/slice";
import { useAppDispatch } from "../../redux";
import { uploadThumbnail, uploadWebGl } from "../../services";
import { AiOutlineCheck } from "react-icons/ai";

export const NewDemoPage = () => {
     const {
          data: categoryData,
          isLoading: isCategoryLoading,
          isError: isCategoryError,
          error: categoryError,
     } = useGetCategoriesQuery();

     const [NewProduct, { isError, error, data, isLoading, isSuccess }] =
          useCreateNewProductMutation();

     type demoType = "video" | "webgl" | "link";
     const [demoType] = useState<demoType>("webgl");

     const navigate = useNavigate();
     const dispatch = useAppDispatch();
     const { files, fileUrls } = useProductSlice();
     const [isWebGlUploaded, setIsWebGlUploaded] = useState<boolean>(false);

     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          if (!event.target.files) return;

          const filesArray = Array.from(event.target.files); // Convert FileList to Array
          if (filesArray.length === 0) {
               dispatch(handleAppError("No files selected"));
               return;
          }

          if (demoType === "webgl") {
               dispatch(
                    handleFiles({ ...files, sourceFile: filesArray as File[] })
               ); // Store files array
          } else {
               dispatch(
                    handleFiles({
                         ...files,
                         sourceFile: filesArray?.[0] as File,
                    })
               ); // Single file for video
          }
     };

     const [webGlUploading, setWebGlUploading] = useState<boolean>(false);

     const uploadFiles = useCallback(async () => {
          if (!files.sourceFile || demoType !== "webgl") return;

          setWebGlUploading(true);
          setIsWebGlUploaded(false);

          try {
               const webGlUrls = await Promise.all(
                    (files.sourceFile as File[]).map((file) =>
                         uploadWebGl(file, "webgl")
                    )
               );

               dispatch(
                    handleFileUrls({
                         sourceUrl: webGlUrls,
                    })
               );

               setIsWebGlUploaded(true);
          } catch (error) {
               console.error("Error uploading WebGL files:", error);
               dispatch(handleAppError("Error uploading WebGL files"));
          } finally {
               setWebGlUploading(false);
          }
     }, [demoType, dispatch, files.sourceFile]);

     useEffect(() => {
          uploadFiles();
     }, [uploadFiles]);

     useEffect(() => {
          if (isSuccess) {
               dispatch(handleAppSuccess(data?.message));
               dispatch(clearFiles());
               setWebGlUploading(false);
               setIsWebGlUploaded(false);
               navigate("/demo", { replace: true });
          }
     }, [isSuccess, dispatch, data?.message, navigate]);

     useEffect(() => {
          if (isCategoryError) {
               const err = categoryError as {
                    data?: { message: string };
                    message: string;
               };
               if (err.data) {
                    dispatch(handleAppError(err.data.message));
               } else {
                    dispatch(handleAppError(err.message));
               }
          }
     }, [dispatch, isCategoryError, categoryError]);

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

     const handleSubmit = async (values: DemoProps) => {
          const webGlIndexUrl: string = (fileUrls.sourceUrl as string[])?.find(
               (url) => url.endsWith("/index.html")
          ) as string;

          if (!values.product_category_id._id) {
               dispatch(handleAppError("Please select a category"));
          } else
               await NewProduct({
                    description: values.description,
                    image_url: fileUrls.thumbnailUrl as string,
                    product_category_id: {
                         _id: values.product_category_id._id as string,
                    },
                    title: values.title,
                    video_url: webGlIndexUrl,
                    is_active: true,
               });
     };

     return (
          <div className="bg-gray-100 p-5 mx-auto w-[80%] rounded-lg">
               <PageTitle
                    title="Upload new demo"
                    subTitle="Fill up the details to create new demo"
               />
               <div className="my-10">
                    <Formik
                         initialValues={{
                              title: "",
                              description: "",
                              image_url: "",
                              video_url: "",
                              product_category_id: {
                                   _id: "",
                                   name: "",
                              },
                              is_active: true,
                         }}
                         onSubmit={handleSubmit}
                    >
                         {({ values, setFieldValue, handleSubmit }) => (
                              <form
                                   onSubmit={handleSubmit}
                                   className="space-y-5"
                              >
                                   {/* <div className="flex items-center gap-3">
                {demoTypeArray.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => setDemoType(item)}
                    className={clsx(
                      "px-4 py-2 rounded-lg border uppercase cursor-pointer",
                      demoType === item
                        ? "border-primary-500 text-primary-500"
                        : "border-gray-500 text-gray-500"
                    )}
                  >
                    <p>{item}</p>
                  </div>
                ))}
              </div> */}

                                   <AppInput
                                        disabled={webGlUploading}
                                        value={values.title}
                                        onChange={(e) => {
                                             //    setFileTitle(e.target.value);
                                             setFieldValue(
                                                  "title",
                                                  e.target.value
                                             );
                                        }}
                                        label="Demo Name"
                                        placeholder="Enter demo name"
                                        name="title"
                                   />

                                   {categoryData && (
                                        <AppSelect
                                             disabled={webGlUploading}
                                             defaultValue={""}
                                             onChange={(e) => {
                                                  setFieldValue(
                                                       "product_category_id._id",
                                                       e.target.value
                                                  );
                                             }}
                                             selectLabel="Category"
                                             name="product_category_id._id"
                                             options={
                                                  categoryData.data.map(
                                                       (item) => ({
                                                            label: item.name,
                                                            value: item._id,
                                                       })
                                                  ) as {
                                                       value: string;
                                                       label: string;
                                                  }[]
                                             }
                                             value={
                                                  values.product_category_id._id
                                             }
                                        />
                                   )}

                                   <div className="flex flex-wrap gap-6">
                                        {!fileUrls.thumbnailUrl && (
                                             <div className="border border-dashed border-primary-500 rounded-lg flex-1 relative overflow-hidden p-6 text-center hover:bg-gray-100 transition-all">
                                                  <input
                                                       type="file"
                                                       className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                                                       onChange={async (e) => {
                                                            if (
                                                                 e.target.files
                                                            ) {
                                                                 const fileUrl =
                                                                      await uploadThumbnail(
                                                                           e
                                                                                .target
                                                                                .files[0] as File
                                                                      );
                                                                 dispatch(
                                                                      handleFileUrls(
                                                                           {
                                                                                ...fileUrls,
                                                                                thumbnailUrl:
                                                                                     fileUrl,
                                                                           }
                                                                      )
                                                                 );
                                                            } else {
                                                                 dispatch(
                                                                      handleAppError(
                                                                           "Please select a file"
                                                                      )
                                                                 );
                                                            }
                                                       }}
                                                  />
                                                  <h4 className="text-primary-500 uppercase font-medium">
                                                       Drop Thumbnail or
                                                  </h4>
                                                  <p className="bg-gray-300 p-2 rounded-lg text-gray-700">
                                                       Select Image File
                                                  </p>
                                             </div>
                                        )}

                                        {fileUrls.thumbnailUrl && (
                                             <div className="flex-1 flex items-center justify-center pb-5">
                                                  <img
                                                       className="w-32 rounded-lg shadow-lg"
                                                       src={
                                                            fileUrls.thumbnailUrl
                                                       }
                                                       alt="Thumbnail"
                                                  />
                                             </div>
                                        )}

                                        {!isWebGlUploaded &&
                                             !webGlUploading &&
                                             (demoType === "video" ||
                                                  demoType === "webgl") && (
                                                  <div className="border border-dashed border-primary-500 rounded-lg flex-1 relative overflow-hidden p-6 text-center hover:bg-gray-100 transition-all">
                                                       <input
                                                            type="file"
                                                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                                                            onChange={
                                                                 handleFileChange
                                                            }
                                                            multiple
                                                            ref={(input) =>
                                                                 input &&
                                                                 (input.webkitdirectory =
                                                                      true)
                                                            }
                                                       />
                                                       <h4 className="text-primary-500 uppercase font-medium">
                                                            Drop {demoType}{" "}
                                                            files or
                                                       </h4>
                                                       <p className="bg-gray-300 p-2 rounded-lg text-gray-700">
                                                            Select {demoType}{" "}
                                                            Files
                                                       </p>
                                                  </div>
                                             )}

                                        {demoType === "link" && (
                                             <div className="flex-1">
                                                  <AppInput
                                                       disabled={webGlUploading}
                                                       value={values.video_url}
                                                       onChange={(e) =>
                                                            setFieldValue(
                                                                 "video_url",
                                                                 e.target.value
                                                            )
                                                       }
                                                       label="Enter Product Video Link"
                                                       name="video_url"
                                                  />
                                             </div>
                                        )}
                                   </div>

                                   {webGlUploading && (
                                        <div className="flex flex-col items-center w-full gap-4 p-6 bg-gray-100 rounded-xl shadow-md animate-pulse">
                                             <div className="flex items-center gap-2">
                                                  <span className="animate-spin text-2xl">
                                                       ⏳
                                                  </span>
                                                  <span className="text-lg font-semibold text-blue-600">
                                                       Uploading...
                                                  </span>
                                             </div>
                                             <p className="text-lg font-semibold text-gray-700 text-center">
                                                  Uploading WebGL files...{" "}
                                                  <br />
                                                  This may take a few minutes.
                                                  Please don’t close this page.
                                             </p>
                                             <div className="w-3/4 bg-gray-300 rounded-full h-2 overflow-hidden">
                                                  <div className="h-full bg-blue-500 animate-pulse"></div>
                                             </div>
                                        </div>
                                   )}
                                   {isWebGlUploaded && (
                                        <div>
                                             <div className="flex flex-col items-center w-full gap-4 p-6 bg-gray-100 rounded-xl shadow-md animate-pulse">
                                                  <div className="flex items-center gap-2">
                                                       <span className="text-2xl">
                                                            <AiOutlineCheck />
                                                       </span>
                                                       <span className="text-lg font-semibold text-blue-600">
                                                            Your WebGL Files
                                                            Uploaded
                                                            Sucessfully!
                                                       </span>
                                                  </div>
                                             </div>
                                        </div>
                                   )}

                                   <Field
                                        disabled={webGlUploading}
                                        as={Textarea}
                                        value={values.description}
                                        onChange={(e) =>
                                             setFieldValue(
                                                  "description",
                                                  e.target.value
                                             )
                                        }
                                        name="description"
                                        className="border border-gray-400 focus:outline-none py-2 px-5 rounded-lg w-full"
                                        rows={5}
                                        placeholder="Enter demo description"
                                   />

                                   <div className="flex justify-end">
                                        <AppButton
                                             disabled={webGlUploading}
                                             loading={
                                                  isCategoryLoading || isLoading
                                             }
                                             type="submit"
                                        >
                                             Submit
                                        </AppButton>
                                   </div>
                              </form>
                         )}
                    </Formik>
               </div>
          </div>
     );
};
