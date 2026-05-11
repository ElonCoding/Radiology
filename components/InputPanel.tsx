import React from 'react';
import { AppMode, PatientMetadata } from '../types';
import { SCAN_TYPES } from '../constants';

interface InputPanelProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  metadata: PatientMetadata;
  setMetadata: (data: PatientMetadata) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  priorFiles: File[];
  setPriorFiles: (files: File[]) => void;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  mode,
  setMode,
  metadata,
  setMetadata,
  files,
  setFiles,
  priorFiles,
  setPriorFiles,
  isAnalyzing,
  onAnalyze
}) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isPrior: boolean) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (isPrior) {
        setPriorFiles([...priorFiles, ...newFiles]);
      } else {
        setFiles([...files, ...newFiles]);
      }
    }
  };

  const removeFile = (index: number, isPrior: boolean) => {
    if (isPrior) {
      setPriorFiles(priorFiles.filter((_, i) => i !== index));
    } else {
      setFiles(files.filter((_, i) => i !== index));
    }
  };

  const updateMetadata = (key: keyof PatientMetadata, value: string) => {
    setMetadata({ ...metadata, [key]: value });
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Input Data
        </h2>

        {/* Mode Toggle */}
        <div className="flex p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setMode(AppMode.SINGLE)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === AppMode.SINGLE ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Single Scan
          </button>
          <button
            onClick={() => setMode(AppMode.COMPARE)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === AppMode.COMPARE ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Compare (Prior + New)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Upload Section */}
        <div className="space-y-4">
          {mode === AppMode.COMPARE && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Prior / Baseline Scans</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, true)} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-slate-500 text-sm">
                  Click to upload priors
                </div>
              </div>
              {priorFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {priorFiles.map((f, i) => (
                    <div key={i} className="relative group w-16 h-16 rounded overflow-hidden border border-slate-200">
                      <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="preview" />
                      <button 
                        onClick={() => removeFile(i, true)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              {mode === AppMode.COMPARE ? 'Current Scans' : 'Radiology Images'}
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors relative">
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={(e) => handleFileChange(e, false)} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-1">
                <svg className="mx-auto h-8 w-8 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-sm text-slate-600">
                  <span className="font-medium text-indigo-600">Upload images</span> or drag and drop
                </div>
                <p className="text-xs text-slate-500">X-Ray, CT, MRI, Ultrasound</p>
              </div>
            </div>
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {files.map((f, i) => (
                  <div key={i} className="relative group w-20 h-20 rounded overflow-hidden border border-slate-200 shadow-sm">
                    <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="preview" />
                    <button 
                      onClick={() => removeFile(i, false)}
                      className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Patient Data Form */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Patient Metadata</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Scan Type</label>
              <select 
                value={metadata.scanType}
                onChange={(e) => updateMetadata('scanType', e.target.value)}
                className="w-full rounded-md border-slate-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
              >
                {SCAN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Sex</label>
               <select 
                 value={metadata.sex}
                 onChange={(e) => updateMetadata('sex', e.target.value)}
                 className="w-full rounded-md border-slate-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
               >
                 <option value="">Select...</option>
                 <option value="Male">Male</option>
                 <option value="Female">Female</option>
               </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Age</label>
               <input 
                type="text" 
                value={metadata.age}
                onChange={(e) => updateMetadata('age', e.target.value)}
                placeholder="e.g. 45"
                className="w-full rounded-md border-slate-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
               />
             </div>
             <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Duration</label>
               <input 
                type="text" 
                value={metadata.duration}
                onChange={(e) => updateMetadata('duration', e.target.value)}
                placeholder="e.g. 3 days"
                className="w-full rounded-md border-slate-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
               />
             </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Symptoms / Chief Complaint</label>
            <textarea 
              rows={3}
              value={metadata.symptoms}
              onChange={(e) => updateMetadata('symptoms', e.target.value)}
              placeholder="e.g. Sharp chest pain, worse with inspiration..."
              className="w-full rounded-md border-slate-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Brief History</label>
            <textarea 
              rows={2}
              value={metadata.history}
              onChange={(e) => updateMetadata('history', e.target.value)}
              placeholder="e.g. Smoker, HTN, previous pneumonia..."
              className="w-full rounded-md border-slate-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
            />
          </div>

        </div>
      </div>

      <div className="p-6 border-t border-slate-200 bg-slate-50">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || files.length === 0}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-md transition-all 
            ${isAnalyzing || files.length === 0 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:transform active:scale-95'
            }`}
        >
          {isAnalyzing ? 'Analyzing...' : 'Run Copilot Analysis'}
        </button>
      </div>
    </div>
  );
};

export default InputPanel;
