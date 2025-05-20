import { useState } from 'react';
import { useAppDispatch } from '../../redux';
import { handleAppError, handleAppSuccess } from '../../redux/slice';
import { 
  useAddDepartmentMutation,
  useAddDesignationMutation,
  // useImportDataMutation,
} from '../../redux/api/departmentDesignation.api';
// import { PageTitle } from '../../component';
import { AppInput } from '../../component';
import { AppButton } from '../../component';

const ManageDepartmentsDesignations = () => {
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [departmentName, setDepartmentName] = useState('');
  const [designationName, setDesignationName] = useState('');

  const [addDepartment] = useAddDepartmentMutation();
  const [addDesignation] = useAddDesignationMutation();
  // const [importData] = useImportDataMutation();

  const handleAddDepartment = async () => {
    if (!departmentName.trim()) return;
    
    try {
      await addDepartment({ name: departmentName.trim() }).unwrap();
      dispatch(handleAppSuccess('Department added'));
      setDepartmentName('');
    } catch (error) {
      dispatch(handleAppError('Failed to add department'));
    }
  };

  const handleAddDesignation = async () => {
    if (!designationName.trim()) return;
    
    try {
      await addDesignation({ name: designationName.trim() }).unwrap();
      dispatch(handleAppSuccess('Designation added'));
      setDesignationName('');
    } catch (error) {
      dispatch(handleAppError('Failed to add designation'));
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // await importData(formData).unwrap();
      dispatch(handleAppSuccess('Data imported'));
      setFile(null);
    } catch (error) {
      dispatch(handleAppError('Failed to import'));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Departments & Designations</h1>
      
      <div className="space-y-4">
        {/* Department Field */}
        <div className="flex items-center gap-2">
          <AppInput
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            placeholder="Department name"
            className="flex-1"
          />
          <AppButton
            onClick={handleAddDepartment}
            disabled={!departmentName.trim()}
            className="w-24"
          >
            Add
          </AppButton>
        </div>

        {/* Designation Field */}
        <div className="flex items-center gap-2">
          <AppInput
            value={designationName}
            onChange={(e) => setDesignationName(e.target.value)}
            placeholder="Designation name"
            className="flex-1"
          />
          <AppButton
            onClick={handleAddDesignation}
            disabled={!designationName.trim()}
            className="w-24"
          >
            Add
          </AppButton>
        </div>

        {/* File Import */}
        <div className="pt-4 border-t mt-4">
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border p-2 rounded flex-1"
            />
            <AppButton
              onClick={handleImport}
              disabled={!file}
              className="w-24"
            >
              Import
            </AppButton>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Upload Excel file with departments and designations
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageDepartmentsDesignations;