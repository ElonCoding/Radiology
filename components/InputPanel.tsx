import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Trash2, 
  User, 
  Stethoscope, 
  Clock, 
  Binary, 
  Plus, 
  Image as ImageIcon,
  ChevronRight,
  Play
} from 'lucide-react';
import { AppMode, PatientMetadata } from '../types';
import { SCAN_TYPES } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-xl relative z-10 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Analysis Setup
          </h2>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Patient Case</span>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 bg-slate-200/50 rounded-xl border border-slate-200">
          <button
            onClick={() => setMode(AppMode.SINGLE)}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2",
              mode === AppMode.SINGLE 
                ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <ImageIcon size={14} />
            Single Scan
          </button>
          <button
            onClick={() => setMode(AppMode.COMPARE)}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2",
              mode === AppMode.COMPARE 
                ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <Binary size={14} />
            Compare Scans
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* Upload Section */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {mode === AppMode.COMPARE && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <label className="label-text flex items-center gap-2">
                  <Clock size={12} />
                  Prior / Baseline Scans
                </label>
                <div className="group relative border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer overflow-hidden">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, true)} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="relative z-0 space-y-2">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-indigo-100 transition-colors">
                      <Plus className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <div className="text-xs font-medium text-slate-500 group-hover:text-slate-700">
                      Add prior studies for comparison
                    </div>
                  </div>
                </div>
                {priorFiles.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {priorFiles.map((f, i) => (
                      <motion.div 
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={`prior-${i}`} 
                        className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 shadow-sm"
                      >
                        <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="preview" />
                        <button 
                          onClick={() => removeFile(i, true)}
                          className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            <label className="label-text flex items-center gap-2">
              <Upload size={12} />
              {mode === AppMode.COMPARE ? 'Current Scans' : 'Radiology Images'}
            </label>
            <div className="group relative border-2 border-dashed border-indigo-200 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer overflow-hidden bg-indigo-50/20">
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={(e) => handleFileChange(e, false)} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="relative z-0 space-y-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-sm">
                  <Upload className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-700">
                    Drop images here
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">X-Ray, CT, MRI, Ultrasound supported</p>
                </div>
              </div>
            </div>
            {files.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {files.map((f, i) => (
                  <motion.div 
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={`current-${i}`} 
                    className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 shadow-md ring-1 ring-black/5"
                  >
                    <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="preview" />
                    <button 
                      onClick={() => removeFile(i, false)}
                      className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-slate-100 mx-2" />

        {/* Patient Data Form */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Clinical Context</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="label-text">Scan Type</label>
              <div className="relative">
                <select 
                  value={metadata.scanType}
                  onChange={(e) => updateMetadata('scanType', e.target.value)}
                  className="input-field appearance-none pr-8 bg-slate-50/50"
                >
                  {SCAN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronRight className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
               <label className="label-text">Patient Sex</label>
               <div className="relative">
                 <select 
                   value={metadata.sex}
                   onChange={(e) => updateMetadata('sex', e.target.value)}
                   className="input-field appearance-none pr-8 bg-slate-50/50"
                 >
                   <option value="">Select...</option>
                   <option value="Male">Male</option>
                   <option value="Female">Female</option>
                 </select>
                 <ChevronRight className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
               <label className="label-text">Age</label>
               <input 
                type="text" 
                value={metadata.age}
                onChange={(e) => updateMetadata('age', e.target.value)}
                placeholder="Years"
                className="input-field bg-slate-50/50"
               />
             </div>
             <div className="space-y-1.5">
               <label className="label-text">Duration</label>
               <input 
                type="text" 
                value={metadata.duration}
                onChange={(e) => updateMetadata('duration', e.target.value)}
                placeholder="e.g. 48h"
                className="input-field bg-slate-50/50"
               />
             </div>
          </div>

          <div className="space-y-1.5">
            <label className="label-text flex items-center gap-2">
              <Stethoscope size={12} />
              Symptoms / Chief Complaint
            </label>
            <textarea 
              rows={3}
              value={metadata.symptoms}
              onChange={(e) => updateMetadata('symptoms', e.target.value)}
              placeholder="Describe primary symptoms..."
              className="input-field bg-slate-50/50 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="label-text flex items-center gap-2">
              <FileText size={12} />
              Relevant Medical History
            </label>
            <textarea 
              rows={2}
              value={metadata.history}
              onChange={(e) => updateMetadata('history', e.target.value)}
              placeholder="Past conditions, surgeries, etc..."
              className="input-field bg-slate-50/50 resize-none"
            />
          </div>

        </div>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || files.length === 0}
          className={cn(
            "w-full py-4 px-6 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-3 relative overflow-hidden group",
            isAnalyzing || files.length === 0 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.98]'
          )}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing Case...</span>
            </>
          ) : (
            <>
              <Play size={18} className="fill-current" />
              <span>Run AI Clinical Analysis</span>
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
            </>
          )}
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-4 font-medium">
          Analysis typically takes 10-20 seconds
        </p>
      </div>
    </div>
  );
};

export default InputPanel;
