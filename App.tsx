import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Layout, ChevronRight, Menu, X, Info } from 'lucide-react';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import { AppMode, AnalysisStatus, PatientMetadata, AnalysisResult } from './types';
import { APP_NAME, DEFAULT_PATIENT_DATA } from './constants';
import { runRadiologyWorkflow } from './services/geminiService';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.SINGLE);
  const [files, setFiles] = useState<File[]>([]);
  const [priorFiles, setPriorFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<PatientMetadata>(DEFAULT_PATIENT_DATA);
  
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [findings, setFindings] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleAnalyze = async () => {
    try {
      setStatus(AnalysisStatus.EXTRACTING);
      
      const { findings, analysis } = await runRadiologyWorkflow(
        files,
        priorFiles,
        metadata,
        mode,
        (s) => setStatus(s as AnalysisStatus)
      );

      setFindings(findings);
      setResult(analysis);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (e) {
      console.error(e);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const isAnalyzing = status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETE && status !== AnalysisStatus.ERROR;

  return (
    <div className="h-screen flex flex-col bg-slate-50/50 overflow-hidden text-slate-900 font-sans">
      
      {/* Safety Banner */}
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-rose-600 text-white text-[10px] sm:text-xs font-bold text-center py-2 px-4 shadow-lg z-[60] flex items-center justify-center gap-2 uppercase tracking-widest"
      >
        <ShieldAlert size={14} className="flex-shrink-0" />
        <span>Not for diagnostic use • clinical decision support only • verify with attending</span>
      </motion.div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-16 flex items-center px-4 sm:px-6 justify-between flex-shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-2 rounded-xl shadow-indigo-200 shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                {APP_NAME}
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                  BETA V1.0
                </span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium sm:hidden">Powered by Gemini 3 Pro</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              System Active
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Gemini 3 Pro Intelligence</div>
          </div>
          <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
            <Info size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Input Panel */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.div 
              initial={{ x: -450, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -450, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute md:relative inset-y-0 left-0 w-[320px] sm:w-[380px] lg:w-[420px] flex-shrink-0 z-40 bg-white"
            >
              <InputPanel 
                mode={mode}
                setMode={setMode}
                metadata={metadata}
                setMetadata={setMetadata}
                files={files}
                setFiles={setFiles}
                priorFiles={priorFiles}
                setPriorFiles={setPriorFiles}
                isAnalyzing={isAnalyzing}
                onAnalyze={handleAnalyze}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop for mobile sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Right Results Panel */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative z-0 overflow-hidden">
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-4 left-4 z-20 p-2 bg-white shadow-md border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all hidden md:block"
            >
              <ChevronRight size={20} />
            </button>
          )}
          
          <ResultsPanel 
            status={status}
            result={result}
            findings={findings}
          />
        </main>

      </div>
    </div>
  );
};

export default App;
