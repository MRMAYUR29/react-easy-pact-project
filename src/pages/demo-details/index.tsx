import { IoMdArrowBack } from "react-icons/io";
import { AppButton, AppLoader, AppModal } from "../../component";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  handleAppError,
  handleAppSuccess,
  useAppSlice,
} from "../../redux/slice";
import {
  useDeleteProductMutation,
  useLazyGetProductByIdQuery,
  useEditDemoProductMutation,
} from "../../redux/api";
import { useAppDispatch } from "../../redux";
import { TbTrash } from "react-icons/tb";
import { DemoProps } from "../../interface"; // Import DemoProps
import { uploadThumbnail, uploadWebGl } from "../../services"; // Import upload services
import { AiOutlineCheck } from "react-icons/ai"; // For upload success icon

// Define a type for your form data that includes all fields you want to edit,
// including the flattened categoryName and temporary file states.
interface DemoFormDataType extends Partial<DemoProps> {
  categoryName?: string;
  newImageFile?: File | null;
  newVideoFile?: File | null;
  newWebGlFolder?: File[] | null;
}

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
      isSuccess: isDeleteSuccess,
    },
  ] = useDeleteProductMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { role } = useAppSlice();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);

  const [formData, setFormData] = useState<DemoFormDataType>({
    title: "",
    categoryName: "",
    image_url: "",
    video_url: "",
    description: "",
    newImageFile: null,
    newVideoFile: null,
    newWebGlFolder: null,
  });

  const [isThumbnailUploading, setIsThumbnailUploading] = useState<boolean>(false);
  const [isWebGlVideoUploading, setIsWebGlVideoUploading] = useState<boolean>(false);
  const [isWebGlVideoUploaded, setIsWebGlVideoUploaded] = useState<boolean>(false);

  const [editProduct, { isLoading: isEditLoading }] =
    useEditDemoProductMutation();

  const openEditModal = () => {
    if (data?.data) {
      setFormData({
        title: data.data.title,
        categoryName: data.data.product_category_id?.name || "",
        image_url: data.data.image_url,
        video_url: data.data.video_url,
        description: data.data.description,
        newImageFile: null,
        newVideoFile: null,
        newWebGlFolder: null,
      });
      setEditModal(true);
      setIsWebGlVideoUploaded(false);
    }
  };

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
          handleAppSuccess(`${data?.data.title} Demo is deleted successfully`)
        );
        navigate(-1);
      })();
    }
  }, [isDeleteSuccess, data, navigate, dispatch]);

  const handleDelete = async (id: string) => {
    await DeleteProduct(id);
  };

  const handleNewImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsThumbnailUploading(true);
      try {
        const imageUrl = await uploadThumbnail(file);
        setFormData((prev) => ({ ...prev, image_url: imageUrl, newImageFile: null }));
        dispatch(handleAppSuccess("Thumbnail uploaded successfully!"));
      } catch (uploadError) {
        dispatch(handleAppError("Failed to upload thumbnail."));
        console.error("Thumbnail upload error:", uploadError);
      } finally {
        setIsThumbnailUploading(false);
      }
    }
  };

  const handleNewVideoWebGLChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const filesArray = Array.from(event.target.files);
    if (filesArray.length === 0) {
      dispatch(handleAppError("No files selected for video/WebGL."));
      return;
    }

    setIsWebGlVideoUploading(true);
    setIsWebGlVideoUploaded(false);

    try {
      if (filesArray.length > 1) {
        const webGlUrls = await Promise.all(
          (filesArray as File[]).map((file) => uploadWebGl(file, "webgl"))
        );
        const webGlIndexUrl = webGlUrls.find((url) =>
          url.endsWith("/index.html")
        ) as string;

        if (webGlIndexUrl) {
          setFormData((prev) => ({ ...prev, video_url: webGlIndexUrl, newWebGlFolder: null }));
          dispatch(handleAppSuccess("WebGL folder uploaded successfully!"));
          setIsWebGlVideoUploaded(true);
        } else {
          dispatch(handleAppError("index.html not found in the uploaded WebGL folder."));
        }
      } else {
        const videoUrl = await uploadWebGl(filesArray[0], "video");
        setFormData((prev) => ({ ...prev, video_url: videoUrl, newVideoFile: null }));
        dispatch(handleAppSuccess("Video uploaded successfully!"));
        setIsWebGlVideoUploaded(true);
      }
    } catch (uploadError) {
      dispatch(handleAppError("Failed to upload video/WebGL files."));
      console.error("Video/WebGL upload error:", uploadError);
    } finally {
      setIsWebGlVideoUploading(false);
    }
  }, [dispatch]);


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
                <span className="text-3xl font-bold text-[#333333] break-words w-[20ch]">
                  {data?.data.title}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {role === "admin" && (
              <>
                <AppButton onClick={openEditModal}>Edit</AppButton>
                <AppButton onClick={() => setDeleteModal(true)} danger>
                  <TbTrash /> Delete
                </AppButton>
              </>
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
            <span className="text-3xl text-[#333333] break-words w-[20ch]">
              {data?.data.title}
            </span>
          </p>
        </div>
      )}
      {!isLoading && (
        <div className="w-full h-[70vh] object-contain aspect-video">
          <iframe
            className="w-full h-full rounded-xl"
            src={data?.data.video_url || "/unity/WebGL/index.html"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      {!isLoading && (
        <div className="flex items-center justify-between">
          {/* <div className="my-10">
            <div
              dangerouslySetInnerHTML={{
                __html: `${
                  data?.data.description || "Description not available"
                }`,
              }}
            />
          </div> */}
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
          Are you want to delete this demo? The action is irreversible.
        </p>
      </AppModal>

      <AppModal
        width="xl" // Increased width to give more space for responsiveness
        isOpen={editModal}
        action={async () => {
          if (data?.data._id) {
            const updates: Partial<DemoProps> = {
              title: formData.title,
              description: formData.description,
              image_url: formData.image_url,
              video_url: formData.video_url,
            };

            if (formData.categoryName !== undefined) {
              updates.product_category_id = {
                name: formData.categoryName,
                _id: data.data.product_category_id?._id,
              };
            }

            await editProduct({
              id: data.data._id,
              updates: updates,
            });
            dispatch(handleAppSuccess("Demo updated successfully"));
            setEditModal(false);
            if (id) await GetProduct(id);
          }
        }}
        btnTitle="Save Changes"
        btnLoader={isEditLoading || isThumbnailUploading || isWebGlVideoUploading}
        modalTitle="Edit Demo"
        toggle={() => setEditModal(!editModal)}
      >
        {/* Main container for modal content - flex column for stacking */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Category Name */}
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={formData.categoryName || ""}
              onChange={(e) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
            />
          </div>

          {/* Image URL & Upload Section */}
          <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thumbnail Image</h3>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              {/* Current Image URL Input and Preview */}
              <div className="flex-1">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Image URL
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.image_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="Existing image URL"
                />
                {formData.image_url && (
                  <div className="mt-3 flex justify-center">
                    <img src={formData.image_url} alt="Current Thumbnail" className="max-h-32 object-contain rounded-md shadow-sm border border-gray-200 p-1" />
                  </div>
                )}
              </div>

              {/* Upload New Image */}
              <div className="flex-1 flex flex-col justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload New Image
                </label>
                <div className="relative border border-dashed border-primary-500 rounded-lg p-4 text-center hover:bg-gray-100 transition-all cursor-pointer h-full flex flex-col justify-center items-center">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    onChange={handleNewImageChange}
                    accept="image/*"
                    disabled={isThumbnailUploading}
                  />
                  {isThumbnailUploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin text-xl text-blue-600">⏳</span>
                      <span className="text-md font-semibold text-blue-600">
                        Uploading thumbnail...
                      </span>
                    </div>
                  ) : (
                    <>
                      <h4 className="text-primary-500 uppercase font-medium">
                        Select new Thumbnail
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Click to browse or drag & drop (Max 300x200 pixels recommended)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Video URL & Upload Section */}
          <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Video / WebGL Content</h3>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              {/* Current Video URL Input */}
              <div className="flex-1">
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Video / WebGL URL
                </label>
                <input
                  type="text"
                  id="videoUrl"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.video_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, video_url: e.target.value })
                  }
                  placeholder="Existing video or WebGL URL"
                />
                {formData.video_url && (
                    <div className="mt-3 flex justify-center text-center">
                        <p className="text-xs text-gray-600 truncate max-w-full italic">Current: {formData.video_url}</p>
                    </div>
                )}
              </div>

              {/* Upload New Video/WebGL */}
              <div className="flex-1 flex flex-col justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload New Video or WebGL Folder
                </label>
                <div className="relative border border-dashed border-primary-500 rounded-lg p-4 text-center hover:bg-gray-100 transition-all cursor-pointer h-full flex flex-col justify-center items-center">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    onChange={handleNewVideoWebGLChange}
                    multiple
                    // @ts-ignore
                    webkitdirectory="true"
                    disabled={isWebGlVideoUploading}
                  />
                  {isWebGlVideoUploading ? (
                    <div className="flex flex-col items-center w-full gap-2">
                      <div className="flex items-center gap-2">
                        <span className="animate-spin text-xl text-blue-600">⏳</span>
                        <span className="text-md font-semibold text-blue-600">
                          Uploading...
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 text-center">
                        This may take a few minutes. Please don’t close this page.
                      </p>
                    </div>
                  ) : isWebGlVideoUploaded ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <AiOutlineCheck className="text-2xl" />
                      <span className="text-md font-semibold">Upload Successful!</span>
                    </div>
                  ) : (
                    <>
                      <h4 className="text-primary-500 uppercase font-medium">
                        Select New Video File or WebGL Folder
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Click to browse or drag & drop (select folder for WebGL)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {/* <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
          </div> */}
        </div>
      </AppModal>
    </div>
  );
};