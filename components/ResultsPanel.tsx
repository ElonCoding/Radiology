import React, { useState } from 'react';
import { AnalysisResult, AnalysisStatus } from '../types';
import { TABS, MOCK_LOADING_STEPS } from '../constants';

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
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-8 text-center">
        <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
        </div>
        <h3 className="text-xl font-medium text-slate-600">Ready for Analysis</h3>
        <p className="max-w-md mt-2">Upload scans and provide patient details to generate a comprehensive radiological assessment.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-8">
        <div className="flex items-center space-x-2 mb-8">
           <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
           <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
           <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        <div className="w-full max-w-md space-y-4">
          {Object.entries(MOCK_LOADING_STEPS).map(([stepKey, label], idx) => {
            // Very basic progress logic
            const steps = Object.keys(MOCK_LOADING_STEPS);
            const currentIdx = steps.indexOf(status);
            const stepIdx = steps.indexOf(stepKey);
            
            let icon = <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />;
            let textClass = "text-slate-400";
            
            if (stepIdx < currentIdx) {
              icon = <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
              textClass = "text-slate-700 font-medium";
            } else if (stepIdx === currentIdx) {
               icon = <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />;
               textClass = "text-indigo-700 font-semibold animate-pulse";
            }

            return (
              <div key={stepKey} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                {icon}
                <span className={`text-sm ${textClass}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (status === AnalysisStatus.ERROR || !result) {
     return (
       <div className="flex-1 flex items-center justify-center bg-red-50 text-red-600 p-8">
         <p>An error occurred during analysis. Please try again.</p>
       </div>
     );
  }

  // Helper to render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'findings':
        return (
          <div className="prose prose-slate max-w-none">
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-700 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              {findings}
            </div>
          </div>
        );

      case 'impression':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Differential Diagnosis</h3>
            <div className="space-y-3">
              {result.differentialDiagnosis.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border-l-4 border-l-indigo-500 shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900">{item.condition}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      item.likelihood === 'High' ? 'bg-red-100 text-red-700' : 
                      item.likelihood === 'Moderate' ? 'bg-amber-100 text-amber-700' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {item.likelihood} Probability
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.reasoning}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'triage':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className={`p-4 rounded-full ${
                result.triageLevel === 'Critical' ? 'bg-red-100 text-red-600' :
                result.triageLevel === 'Emergent' ? 'bg-orange-100 text-orange-600' :
                result.triageLevel === 'Urgent' ? 'bg-amber-100 text-amber-600' :
                'bg-emerald-100 text-emerald-600'
              }`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Recommended Triage Level</h4>
                <div className={`text-3xl font-bold ${
                  result.triageLevel === 'Critical' ? 'text-red-700' :
                  result.triageLevel === 'Emergent' ? 'text-orange-700' :
                  result.triageLevel === 'Urgent' ? 'text-amber-700' :
                  'text-emerald-700'
                }`}>
                  {result.triageLevel}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h4 className="text-lg font-bold text-slate-900 mb-4">Recommended Next Steps</h4>
               <ul className="space-y-3">
                 {result.nextSteps.map((step, i) => (
                   <li key={i} className="flex items-start gap-3 text-slate-700">
                     <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold border border-indigo-100">{i+1}</span>
                     <span>{step}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        );
      
      case 'summary':
        return (
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-lg font-bold text-slate-800">Patient-Friendly Summary</h3>
            </div>
            <p className="text-lg text-slate-700 leading-relaxed font-light">
              "{result.patientFriendlySummary}"
            </p>
            <div className="mt-8 p-4 bg-slate-50 rounded-lg text-sm text-slate-500">
              <span className="font-semibold">Note to Clinician:</span> Validate this explanation before sharing with the patient.
            </div>
          </div>
        );

      case 'safety':
        return (
          <div className="space-y-6">
             <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
               <h4 className="text-amber-800 font-bold flex items-center gap-2 mb-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 Safety & Uncertainty Flags
               </h4>
               <ul className="list-disc pl-5 space-y-2 text-amber-900">
                 {result.uncertaintyFlags.map((flag, i) => (
                   <li key={i}>{flag}</li>
                 ))}
               </ul>
             </div>

             <div className="bg-slate-800 text-slate-100 p-6 rounded-lg shadow-lg">
               <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">AI Safety Notes</h4>
               <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                 <p>{result.safetyNotes}</p>
               </div>
             </div>
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 pt-4 sticky top-0 z-10">
        <div className="flex space-x-6 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
