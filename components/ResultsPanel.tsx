import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  Search, 
  Activity, 
  MessageSquare, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  Info,
  CheckCircle2,
  BrainCircuit,
  FileText,
  Stethoscope
} from 'lucide-react';
import { AnalysisResult, AnalysisStatus } from '../types';
import { TABS, MOCK_LOADING_STEPS } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ResultsPanelProps {
  status: AnalysisStatus;
  result: AnalysisResult | null;
  findings: string;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ status, result, findings }) => {
  const [activeTab, setActiveTab] = useState('findings');

  const isLoading = status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETE && status !== AnalysisStatus.ERROR;

  if (status === AnalysisStatus.IDLE) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/30 p-8 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-xl shadow-indigo-100/50 rotate-3 group-hover:rotate-6 transition-transform">
            <BrainCircuit className="w-12 h-12 text-indigo-600" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-emerald-500" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-md"
        >
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">AI Diagnostic Workspace</h3>
          <p className="text-slate-500 mt-3 leading-relaxed font-medium">
            Upload radiological studies and provide clinical context to begin a comprehensive multi-modal analysis.
          </p>
          
          <div className="grid grid-cols-2 gap-3 mt-10">
            {[
              { icon: FileText, label: 'Visual Analysis' },
              { icon: ShieldCheck, label: 'Safety Verified' },
              { icon: Stethoscope, label: 'Clinical Logic' },
              { icon: MessageSquare, label: 'Patient Ready' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-slate-200/60 shadow-sm">
                <item.icon size={16} className="text-indigo-500" />
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 p-8 relative overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-100/40 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-violet-100/40 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
          <div className="mb-12 relative">
             <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center border border-slate-100">
               <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
             </div>
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute -inset-4 bg-indigo-500/10 rounded-[32px] -z-10"
             />
          </div>
          
          <div className="text-center mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Clinical Case</h3>
            <p className="text-sm text-slate-500 font-medium">Gemini 3 is processing visual and textual data...</p>
          </div>

          <div className="w-full space-y-3">
            {Object.entries(MOCK_LOADING_STEPS).map(([stepKey, label], idx) => {
              const steps = Object.keys(MOCK_LOADING_STEPS);
              const currentIdx = steps.indexOf(status);
              const stepIdx = steps.indexOf(stepKey);
              
              const isCompleted = stepIdx < currentIdx;
              const isActive = stepIdx === currentIdx;

              return (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  key={stepKey} 
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500",
                    isCompleted ? "bg-emerald-50 border-emerald-100 shadow-sm" : 
                    isActive ? "bg-white border-indigo-200 shadow-xl scale-[1.02]" : 
                    "bg-slate-50/50 border-slate-100 opacity-50"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500",
                    isCompleted ? "bg-emerald-500 text-white" : 
                    isActive ? "bg-indigo-600 text-white" : 
                    "bg-slate-200 text-slate-400"
                  )}>
                    {isCompleted ? <CheckCircle2 size={18} /> : 
                     isActive ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 
                     <span className="text-xs font-bold">{idx + 1}</span>}
                  </div>
                  <span className={cn(
                    "text-sm font-bold tracking-tight transition-colors duration-500",
                    isCompleted ? "text-emerald-700" : 
                    isActive ? "text-indigo-900" : 
                    "text-slate-400"
                  )}>
                    {label}
                  </span>
                  {isActive && (
                    <div className="ml-auto flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (status === AnalysisStatus.ERROR || !result) {
     return (
       <div className="flex-1 flex items-center justify-center bg-red-50/30 p-8">
         <div className="text-center max-w-sm">
           <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
             <AlertTriangle className="w-8 h-8 text-red-600" />
           </div>
           <h3 className="text-lg font-bold text-slate-900">Analysis Failed</h3>
           <p className="text-sm text-slate-500 mt-2 leading-relaxed">
             We encountered an issue while processing your request. This could be due to image quality or service connectivity.
           </p>
           <button 
             onClick={() => window.location.reload()}
             className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
           >
             Try Again
           </button>
         </div>
       </div>
     );
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'findings':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-600" />
                Visual Observations
              </h3>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                AI Generated findings
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft leading-relaxed">
              <div className="prose prose-slate max-w-none">
                <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-700">
                  {findings}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'impression':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-600" />
                Differential Diagnosis
              </h3>
            </div>
            <div className="grid gap-4">
              {result.differentialDiagnosis.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{item.condition}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              item.likelihood === 'High' ? 'w-full bg-red-500' : 
                              item.likelihood === 'Moderate' ? 'w-2/3 bg-amber-500' : 
                              'w-1/3 bg-slate-400'
                            )}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.likelihood} Probability</span>
                      </div>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      item.likelihood === 'High' ? 'bg-red-50 text-red-700 border border-red-100' : 
                      item.likelihood === 'Moderate' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                      'bg-slate-50 text-slate-600 border border-slate-100'
                    )}>
                      {item.likelihood}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.reasoning}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'triage':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="relative bg-white p-10 rounded-[40px] border border-slate-200 shadow-xl overflow-hidden group">
              <div className={cn(
                "absolute top-0 left-0 w-2 h-full transition-colors duration-500",
                result.triageLevel === 'Critical' ? 'bg-red-600' :
                result.triageLevel === 'Emergent' ? 'bg-orange-500' :
                result.triageLevel === 'Urgent' ? 'bg-amber-500' :
                'bg-emerald-500'
              )} />
              
              <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
                <div className={cn(
                  "w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                  result.triageLevel === 'Critical' ? 'bg-red-50 text-red-600 shadow-red-100' :
                  result.triageLevel === 'Emergent' ? 'bg-orange-50 text-orange-600 shadow-orange-100' :
                  result.triageLevel === 'Urgent' ? 'bg-amber-50 text-amber-600 shadow-amber-100' :
                  'bg-emerald-50 text-emerald-600 shadow-emerald-100'
                )}>
                  <AlertTriangle size={40} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Severity Assessment</h4>
                  <div className={cn(
                    "text-5xl font-black tracking-tight",
                    result.triageLevel === 'Critical' ? 'text-red-700' :
                    result.triageLevel === 'Emergent' ? 'text-orange-700' :
                    result.triageLevel === 'Urgent' ? 'text-amber-700' :
                    'text-emerald-700'
                  )}>
                    {result.triageLevel}
                  </div>
                </div>
                <div className="md:ml-auto md:text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl">
                    <Clock size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">Immediate Action Required</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-soft">
               <div className="flex items-center gap-3 mb-8">
                 <div className="p-2 bg-indigo-50 rounded-xl">
                   <ClipboardList className="w-5 h-5 text-indigo-600" />
                 </div>
                 <h4 className="text-lg font-bold text-slate-900">Recommended Clinical Pathway</h4>
               </div>
               <div className="space-y-4">
                 {result.nextSteps.map((step, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     key={i} 
                     className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-sm transition-all group"
                   >
                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center text-xs font-black border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                       {i+1}
                     </div>
                     <span className="text-sm text-slate-700 font-bold tracking-tight">{step}</span>
                     <ChevronRight size={16} className="ml-auto text-slate-300 group-hover:text-indigo-400 transition-colors" />
                   </motion.div>
                 ))}
               </div>
            </div>
          </motion.div>
        );
      
      case 'summary':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-1 rounded-[40px] shadow-2xl shadow-indigo-200">
              <div className="bg-white p-10 rounded-[39px]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Patient-Friendly Brief</h3>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Non-Technical Explanation</p>
                  </div>
                </div>
                
                <div className="relative">
                  <span className="absolute -top-4 -left-2 text-6xl text-indigo-100 font-serif leading-none">“</span>
                  <p className="text-xl text-slate-700 leading-relaxed font-medium relative z-10 italic">
                    {result.patientFriendlySummary}
                  </p>
                  <div className="flex justify-end mt-2">
                    <span className="text-6xl text-indigo-100 font-serif leading-none rotate-180">“</span>
                  </div>
                </div>

                <div className="mt-10 p-5 bg-slate-50 rounded-2xl flex items-start gap-4 border border-slate-200/60">
                  <Info className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    <span className="font-bold text-slate-700">Clinician Note:</span> This summary is optimized for health literacy but should be reviewed for clinical accuracy before being shared with the patient.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'safety':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
             <div className="bg-amber-50 border border-amber-200 rounded-[32px] p-8 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-amber-100 rounded-xl">
                   <AlertTriangle className="w-5 h-5 text-amber-700" />
                 </div>
                 <h4 className="text-amber-900 font-bold text-lg">Potential Uncertainties</h4>
               </div>
               <div className="grid gap-3">
                 {result.uncertaintyFlags.map((flag, i) => (
                   <div key={i} className="flex items-start gap-3 bg-white/50 p-4 rounded-2xl border border-amber-100">
                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                     <span className="text-sm text-amber-900 font-medium leading-relaxed">{flag}</span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <ShieldCheck size={120} />
               </div>
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                   <ShieldCheck className="w-6 h-6 text-emerald-400" />
                   <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">AI Safety Protocols</h4>
                 </div>
                 <div className="prose prose-invert max-w-none">
                   <p className="text-lg text-slate-300 leading-relaxed font-medium italic">
                     "{result.safetyNotes}"
                   </p>
                 </div>
                 <div className="mt-8 flex items-center gap-4">
                   <div className="h-px bg-slate-800 flex-1" />
                   <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">End of report</div>
                   <div className="h-px bg-slate-800 flex-1" />
                 </div>
               </div>
             </div>
          </motion.div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-white/60 backdrop-blur-md border-b border-slate-200/60 px-8 pt-4 sticky top-0 z-20">
        <div className="flex space-x-8 overflow-x-auto no-scrollbar max-w-4xl mx-auto">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="group relative pb-4 flex flex-col items-center"
              >
                <span className={cn(
                  "text-[11px] font-bold uppercase tracking-widest transition-all duration-300 mb-1",
                  isActive ? "text-indigo-600 scale-105" : "text-slate-400 group-hover:text-slate-600"
                )}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 w-full h-1 bg-indigo-600 rounded-t-full shadow-[0_-4px_10px_rgba(79,70,229,0.3)]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
        <div className="max-w-4xl mx-auto pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
