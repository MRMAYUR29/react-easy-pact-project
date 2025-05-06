import { IoMdArrowBack } from "react-icons/io";
import { AppButton, AppLoader, AppModal } from "../../component";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
     handleAppError,
     handleAppSuccess,
     useAppSlice,
} from "../../redux/slice";
import {
     useDeleteProductMutation,
     useLazyGetProductByIdQuery,
} from "../../redux/api";
import { useAppDispatch } from "../../redux";
import { TbTrash } from "react-icons/tb";

export const DemoDetailsPage = () => {
     const { id } = useParams();

     const [GetProduct, { data, isLoading, isError, error }] =
          useLazyGetProductByIdQuery();
     const [
          DeleteProduct,
          {
               isLoading: isDeleteLoading,
               isError: isDeleteError,
               error: deleteError,
               data: deleteData,
               isSuccess: isDeleteSuccess,
          },
     ] = useDeleteProductMutation();
     const dispatch = useAppDispatch();
     // const [modal, setModal] = useState<boolean>(false);
     const navigate = useNavigate();
     const { role } = useAppSlice();
     const [deleteModal, setDeleteModal] = useState<boolean>(false);

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
          if (isDeleteError) {
               const err = deleteError as {
                    data?: { message: string };
                    message: string;
               };
               if (err.data) {
                    dispatch(handleAppError(err.data.message));
               } else {
                    dispatch(handleAppError(err.message));
               }
          }
     }, [dispatch, isDeleteError, deleteError]);

     useEffect(() => {
          if (id) {
               (async () => {
                    await GetProduct(id);
               })();
          }
     }, [id, GetProduct]);

     useEffect(() => {
          if (isDeleteSuccess) {
               (async () => {
                    dispatch(
                         handleAppSuccess(
                              `${data?.data.title} Demo is deleted successfully`
                         )
                    );
                    navigate(-1);
               })();
          }
     }, [isDeleteSuccess, data, navigate, dispatch]);

     // const handleSubmit = (prop: unknown) => {
     //   console.log(prop);
     // };

     const handleDelete = async (id: string) => {
          await DeleteProduct(id);
     };

     return (
          <div className="container mx-auto w-[80%]">
               {isLoading && <AppLoader />}
               {!isLoading && (role === "admin" || role === "regional") && (
                    <div className="mb-6 flex items-center justify-between gap-10">
                         <div className="flex items-center gap-5">
                              <button
                                   onClick={() => navigate(-1)}
                                   className="p-3 bg-primary-500 rounded-xl text-white"
                              >
                                   <IoMdArrowBack className="size-8" />
                              </button>
                              <div>
                                   <h5 className="text-md truncate tracking-tight text-slate-500">
                                        {data?.data.product_category_id?.name}
                                   </h5>
                                   <p>
                                        <span className="text-3xl font-bold text-slate-900 truncate">
                                             {data?.data.title}
                                        </span>
                                   </p>
                              </div>
                         </div>
                         <div className="flex items-center gap-4">
                              {role === "admin" && (
                                   <AppButton
                                        onClick={() => setDeleteModal(true)}
                                        danger
                                   >
                                        <TbTrash /> Delete
                                   </AppButton>
                              )}
                         </div>
                    </div>
               )}
               {!isLoading && role === "employee" && (
                    <div className="mb-5">
                         <h5 className="text-md truncate tracking-tight text-slate-500">
                              {data?.data.product_category_id?.name}
                         </h5>
                         <p>
                              <span className="text-3xl text-slate-900 truncate">
                                   {data?.data.title}
                              </span>
                         </p>
                    </div>
               )}
               {!isLoading && (
                    <div className="w-full h-[70vh] object-contain aspect-video">
                         <iframe
                              className="w-full h-full rounded-xl"
                              src={
                                   data?.data.video_url ||
                                   "/unity/WebGL/index.html"
                              }
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                         ></iframe>
                    </div>
               )}
               {!isLoading && (
                    <div className="flex items-center justify-between">
                         <div className="my-10">
                              <div
                                   dangerouslySetInnerHTML={{
                                        __html: `${
                                             data?.data.description ||
                                             "Description not available"
                                        }`,
                                   }}
                              />
                         </div>
                    </div>
               )}

               <AppModal
                    width="md"
                    isOpen={deleteModal}
                    action={() => handleDelete(data?.data._id || "")}
                    btnTitle="Yes I Confirm"
                    btnLoader={isDeleteLoading}
                    modalTitle="Please confirm if you want to delete this demo"
                    toggle={() => setDeleteModal(!deleteModal)}
               >
                    <p className="text-gray-500">
                         Are you want to delete this demo? The action is
                         irreversible.
                    </p>
               </AppModal>
               {/* <Dialog
        open={modal}
        onClose={() => setModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex bg-gray-950 bg-opacity-50 w-screen items-center justify-center p-4">
          <DialogPanel className="xl:w-[40%] space-y-4 border bg-white p-5 rounded-xl">
            <DialogTitle className="font-bold text-xl">
              Fill the details
            </DialogTitle>

            <div>
              <Formik initialValues={{}} onSubmit={handleSubmit}>
                {() => (
                  <form>
                    <div>
                      <AppInput label="Enter customer name" />
                    </div>
                  </form>
                )}
              </Formik>
            </div>
            <div className="flex gap-4 justify-end">
              <button className="text-gray-500" onClick={() => setModal(false)}>
                Cancel
              </button>
              <AppButton>Confirm</AppButton>{" "}
            </div>
          </DialogPanel>
        </div>
      </Dialog> */}
          </div>
     );
};
