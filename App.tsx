import React, { useState } from 'react';
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

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden text-slate-800">
      
      {/* Safety Banner */}
      <div className="bg-rose-600 text-white text-xs font-bold text-center py-2 px-4 shadow-md z-50">
        ⚠️ NOT A FINAL DIAGNOSIS. FOR CLINICAL DECISION SUPPORT & EDUCATIONAL USE ONLY. ALWAYS VERIFY WITH ATTENDING.
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 justify-between flex-shrink-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{APP_NAME} <span className="text-slate-400 font-normal text-sm ml-2">Beta v1.0</span></h1>
        </div>
        <div className="text-sm text-slate-500 hidden md:block">
          Powered by Gemini 3 Pro
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Input Panel (35% width) */}
        <div className="w-full md:w-[400px] lg:w-[450px] flex-shrink-0 z-30 relative">
          <InputPanel 
            mode={mode}
            setMode={setMode}
            metadata={metadata}
            setMetadata={setMetadata}
            files={files}
            setFiles={setFiles}
            priorFiles={priorFiles}
            setPriorFiles={setPriorFiles}
            isAnalyzing={status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETE && status !== AnalysisStatus.ERROR}
            onAnalyze={handleAnalyze}
          />
        </div>

        {/* Right Results Panel */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative z-0">
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
