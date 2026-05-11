import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, DifferentialItem, PatientMetadata, AppMode } from "../types";
import { MODEL_NAME } from "../constants";

// Initialize the client
const apiKey = (process.env.API_KEY || "").trim();
const ai = apiKey ? new GoogleGenAI(apiKey) : null;

// Schema for the Structured Output (Steps 2 & 3)
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    differentialDiagnosis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          condition: { type: Type.STRING },
          likelihood: { type: Type.STRING, enum: ['High', 'Moderate', 'Low'] },
          reasoning: { type: Type.STRING }
        },
        required: ['condition', 'likelihood', 'reasoning']
      }
    },
    triageLevel: {
      type: Type.STRING,
      enum: ['Routine', 'Urgent', 'Emergent', 'Critical']
    },
    nextSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    patientFriendlySummary: { type: Type.STRING },
    safetyNotes: { type: Type.STRING },
    uncertaintyFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ['differentialDiagnosis', 'triageLevel', 'nextSteps', 'patientFriendlySummary', 'safetyNotes', 'uncertaintyFlags']
};

/**
 * Helper to convert file to Base64
 */
export const fileToPart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64String = reader.result.split(',')[1];
        resolve({
          inlineData: {
            data: base64String,
            mimeType: file.type,
          },
        });
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Step 1: Visual Findings Extraction
 */
export const extractFindings = async (
  files: File[], 
  scanType: string,
  mode: AppMode,
  priorFiles: File[] = []
): Promise<string> => {
  const imageParts = await Promise.all(files.map(fileToPart));
  
  let prompt = `
    You are an expert radiologist. Analyze the provided ${scanType} images. 
    List all visual findings systematically (bones, soft tissue, organs, devices/foreign bodies). 
    Be purely descriptive and objective. Do not jump to conclusions yet.
    Format the output using clear Markdown with bullet points.
  `;

  const contents = [...imageParts];

  if (mode === AppMode.COMPARE && priorFiles.length > 0) {
    const priorParts = await Promise.all(priorFiles.map(fileToPart));
    prompt = `
      You are an expert radiologist conducting a comparative analysis.
      
      SET A (First ${priorParts.length} images): PRIOR/BASELINE SCANS
      SET B (Remaining images): CURRENT SCANS
      
      Compare the current scans against the baseline. 
      Focus explicitly on:
      1. New findings.
      2. Progression or regression of previous findings.
      3. Stable findings.
      
      List visual findings systematically.
    `;
    contents.unshift(...priorParts); // Prior first, then current
  }

  contents.push({ text: prompt } as any);

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: contents as any[] 
    }
  });

  return response.text || "No findings generated.";
};

/**
 * Step 2: Clinical Reasoning
 */
export const generateClinicalReasoning = async (
  findings: string,
  metadata: PatientMetadata
): Promise<AnalysisResult> => {
  const prompt = `
    Role: Senior Radiologist & Clinical Decision Support System.
    
    Task: Based ONLY on the visual findings provided and the patient metadata, generate a clinical assessment.
    
    Context:
    - Patient Age: ${metadata.age}
    - Patient Sex: ${metadata.sex}
    - Symptoms: ${metadata.symptoms}
    - Duration: ${metadata.duration}
    - History: ${metadata.history}
    
    Visual Findings:
    ${findings}
    
    Required Output (JSON):
    1. Differential Diagnosis: List potential conditions with likelihood and specific reasoning mapping back to findings.
    2. Triage Level: Routine, Urgent, Emergent, or Critical.
    3. Next Steps: Recommend imaging, labs, or referrals.
    4. Patient Summary: A simplified explanation (avoid jargon) suitable for explaining to the patient.
    5. Safety/Uncertainty: Initial thoughts on what might be missed or requires caution.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema
    }
  });

  if (!response.text) throw new Error("Failed to generate reasoning");
  return JSON.parse(response.text) as AnalysisResult;
};

/**
 * Step 3: Safety Gate & Red Flag Check
 */
export const safetyGateCheck = async (
  initialAnalysis: AnalysisResult,
  metadata: PatientMetadata
): Promise<AnalysisResult> => {
  const prompt = `
    Role: Medical Safety Officer & Quality Assurance.
    
    Task: Review the following clinical analysis for safety, accuracy, and appropriate uncertainty language.
    
    Input Analysis:
    ${JSON.stringify(initialAnalysis)}
    
    Patient Context:
    ${metadata.age} ${metadata.sex}, ${metadata.symptoms}
    
    Rules:
    1. Soften definitive claims. Use "suggestive of", "consistent with", "possible" instead of "is" or "diagnostic of" unless pathognomonic.
    2. Ensure RED FLAGS are highlighted if the triage level is high but the language is too casual.
    3. Add standard decision support disclaimers to the 'safetyNotes'.
    4. If the initial analysis missed a life-threatening possibility based on symptoms (e.g., aortic dissection in chest pain), add it to the differential or uncertainty flags.
    
    Output the revised JSON structure strictly adhering to the schema.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema
    }
  });

  if (!response.text) throw new Error("Safety check failed");
  return JSON.parse(response.text) as AnalysisResult;
};

/**
 * Main Workflow Orchestrator
 */
export const runRadiologyWorkflow = async (
  files: File[],
  priorFiles: File[],
  metadata: PatientMetadata,
  mode: AppMode,
  onStatusChange: (status: string) => void
): Promise<{ findings: string; analysis: AnalysisResult }> => {
  if (!ai) {
    throw new Error("Gemini API Key is not configured. Please add GEMINI_API_KEY to your .env file.");
  }
  
  // Step 1
  onStatusChange('EXTRACTING_FINDINGS');
  const findings = await extractFindings(files, metadata.scanType, mode, priorFiles);
  
  // Step 2
  onStatusChange('CLINICAL_REASONING');
  const initialAnalysis = await generateClinicalReasoning(findings, metadata);
  
  // Step 3
  onStatusChange('SAFETY_CHECK');
  const finalAnalysis = await safetyGateCheck(initialAnalysis, metadata);
  
  // Inject the findings text into the final object for the UI to use if needed, 
  // though we return it separately too.
  finalAnalysis.visualFindings = findings;

  return { findings, analysis: finalAnalysis };
};
