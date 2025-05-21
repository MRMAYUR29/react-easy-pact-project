import React, { useState } from "react";
import {
  useUploadDepartmentFileMutation,
  useUploadDesignationFileMutation,
  useGetDepartmentsQuery,
  useGetDesignationsQuery,
} from "../../redux/api/departmentDesignation.api";

const ManageDepartmentsDesignations = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");

  const {
    data: departments,
    refetch: refetchDepartments,
  } = useGetDepartmentsQuery();

  const {
    data: designations,
    refetch: refetchDesignations,
  } = useGetDesignationsQuery();

  const [uploadDepartmentFile, { isLoading: deptUploading }] =
    useUploadDepartmentFileMutation();
  const [uploadDesignationFile, { isLoading: desigUploading }] =
    useUploadDesignationFileMutation();

  const handleDepartmentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadDepartmentFile(formData).unwrap();
      refetchDepartments();
      alert("Department file uploaded successfully!");
    } catch (error) {
      console.error("Error uploading department file", error);
      alert("Failed to upload department file.");
    }
  };

  const handleDesignationUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadDesignationFile(formData).unwrap();
      refetchDesignations();
      alert("Designation file uploaded successfully!");
    } catch (error) {
      console.error("Error uploading designation file", error);
      alert("Failed to upload designation file.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">
        Manage Departments & Designations
      </h2>

      {/* Department Section */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Department</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Department</option>
          {departments?.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <div className="mt-2">
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleDepartmentUpload}
          />
          {deptUploading && (
            <p className="text-sm text-gray-500">Uploading...</p>
          )}
        </div>
      </div>

      {/* Designation Section */}
      <div>
        <label className="block mb-1 font-medium">Designation</label>
        <select
          value={selectedDesignation}
          onChange={(e) => setSelectedDesignation(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Designation</option>
          {designations?.map((desig, index) => (
            <option key={index} value={desig}>
              {desig}
            </option>
          ))}
        </select>

        <div className="mt-2">
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleDesignationUpload}
          />
          {desigUploading && (
            <p className="text-sm text-gray-500">Uploading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDepartmentsDesignations;
