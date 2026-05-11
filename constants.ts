import { AppMode } from './types';

export const APP_NAME = "Radiology Copilot";
export const MODEL_NAME = "gemini-3-pro-preview"; 

export const DEFAULT_PATIENT_DATA = {
  age: '',
  sex: '',
  symptoms: '',
  duration: '',
  scanType: 'X-Ray',
  history: ''
};

export const TABS = [
  { id: 'findings', label: 'Visual Findings' },
  { id: 'impression', label: 'Impression & Differential' },
  { id: 'triage', label: 'Triage & Next Steps' },
  { id: 'summary', label: 'Patient Summary' },
  { id: 'safety', label: 'Safety & Uncertainty' },
];

export const SCAN_TYPES = [
  'X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'Photo of Film', 'Other'
];

export const MOCK_LOADING_STEPS = {
  EXTRACTING_FINDINGS: "Analyzing visual patterns in imagery...",
  CLINICAL_REASONING: "Synthesizing clinical findings and patient history...",
  SAFETY_CHECK: "Running safety guardrails and uncertainty validation...",
};
