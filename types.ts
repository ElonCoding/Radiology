export enum AppMode {
  SINGLE = 'SINGLE',
  COMPARE = 'COMPARE'
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  EXTRACTING = 'EXTRACTING_FINDINGS',
  REASONING = 'CLINICAL_REASONING',
  SAFETY = 'SAFETY_CHECK',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface PatientMetadata {
  age: string;
  sex: string;
  symptoms: string;
  duration: string;
  scanType: string;
  history: string;
}

export interface DifferentialItem {
  condition: string;
  likelihood: 'High' | 'Moderate' | 'Low';
  reasoning: string;
}

export interface AnalysisResult {
  visualFindings: string;
  differentialDiagnosis: DifferentialItem[];
  triageLevel: 'Routine' | 'Urgent' | 'Emergent' | 'Critical';
  nextSteps: string[];
  patientFriendlySummary: string;
  safetyNotes: string;
  uncertaintyFlags: string[];
}

// For internal use in the Compare mode
export interface CompareResult extends AnalysisResult {
  comparisonDelta: string;
}
