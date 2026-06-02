import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadTasksApi } from '../../api/services.js';
import { FiUploadCloud, FiFileText, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const UploadPage = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const uploadMutation = useMutation({
    mutationFn: (file) => uploadTasksApi(file),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || 'Tasks uploaded and distributed successfully!');
        setUploadResult({
          totalUploaded: res.data.totalUploaded,
          tasks: res.data.tasks
        });
        setFile(null);
        queryClient.invalidateQueries({ queryKey: ['stats'] });
        queryClient.invalidateQueries({ queryKey: ['grouped-tasks'] });
      } else {
        toast.error(res.message || 'Upload failed');
      }
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error occurred during file upload';
      toast.error(msg);
    }
  });

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    const allowedExtensions = ['csv', 'xls', 'xlsx'];
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(extension)) {
      toast.error('Invalid file type. Only CSV, XLS, and XLSX are accepted.');
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        setUploadResult(null);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file first.');
      return;
    }
    uploadMutation.mutate(file);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-oat-100 p-8 rounded-2xl border border-oat-400 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Upload Task File</h2>
        <p className="text-slate-650 text-xs mb-6 leading-relaxed">
          Upload a file containing leads. Required columns: <span className="font-bold text-slate-800">FirstName</span>, <span className="font-bold text-slate-800">Phone</span>, and <span className="font-bold text-slate-800">Notes</span>. Accepted extensions: .csv, .xls, .xlsx.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all text-center flex flex-col items-center justify-center min-h-[220px] ${
              dragActive ? 'border-oat-500 bg-oat-200/50' : 'border-oat-400 hover:border-oat-500 bg-oat-300/30'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              accept=".csv,.xls,.xlsx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer animate-pulse"
            />
            
            <FiUploadCloud className="w-12 h-12 text-slate-500 mb-3" />
            
            {file ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-850 flex items-center justify-center gap-2">
                  <FiFileText className="w-4 h-4 text-slate-700" />
                  {file.name}
                </p>
                <p className="text-xs text-slate-600">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold text-slate-700">
                  Drag and drop your file here, or <span className="text-slate-900 underline">browse</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports CSV, XLS, XLSX up to 10MB</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {file && (
              <button
                type="button"
                onClick={() => setFile(null)}
                className="flex-1 py-2.5 rounded-lg border border-oat-400 text-slate-800 text-sm font-bold bg-oat-200 hover:bg-oat-300 transition-all"
              >
                Clear Selection
              </button>
            )}
            <button
              type="submit"
              disabled={!file || uploadMutation.isPending}
              className={`py-2.5 rounded-lg text-slate-850 text-sm font-bold border border-oat-400 transition-all ${
                file ? 'flex-1 bg-oat-500 hover:bg-oat-400' : 'w-full bg-oat-200 text-slate-400 cursor-not-allowed'
              } disabled:opacity-50`}
            >
              {uploadMutation.isPending ? 'Uploading & Distributing...' : 'Distribute Tasks'}
            </button>
          </div>
        </form>
      </div>

      {uploadResult && (
        <div className="bg-oat-400 border border-oat-500 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-slate-800">
            <FiCheckCircle className="w-6 h-6 text-slate-700 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-sm">Distribution Summary</h3>
              <p className="text-xs text-slate-750 mt-0.5 font-medium">
                Successfully processed and equally distributed {uploadResult.totalUploaded} tasks.
              </p>
            </div>
          </div>
          
          <div className="bg-oat-100 rounded-xl border border-oat-400 p-4">
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Assigned Task Logs</p>
            <div className="max-h-48 overflow-y-auto mt-2 text-xs divide-y divide-oat-200">
              {uploadResult.tasks.map((task, idx) => (
                <div key={task._id || idx} className="py-2 flex justify-between items-center text-slate-800">
                  <span className="font-bold">{task.firstName}</span>
                  <span className="text-slate-650">{task.phone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
