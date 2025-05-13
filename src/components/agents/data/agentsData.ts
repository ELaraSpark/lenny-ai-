// Data: agentsData
// Purpose: Provides mock data for AI agents, including their details, capabilities, and styling properties.
// Used in: AIAgentsView, AgentSelector.

import {
  Heart, Brain, Microscope, Stethoscope, Eye, BarChart4, Pill, Activity,
  HeartPulse, BrainCircuit, SearchCheck, Wind, Droplet, ScanFace, ShieldAlert,
  HelpingHand, Bone, Users, MessageSquare, FileCheck, Scale, FlaskConical,
  ClipboardList, UserCheck, TestTubeDiagonal, FolderKanban, FileLock, SearchCode,
  ClipboardCheck, BookUser, Speech, PersonStanding, Recycle, Bot, Dna, HandHeart,
  GraduationCap, Briefcase, FileQuestion, ShieldCheck, FileSearch, UserCog
} from "lucide-react";
import { Agent } from "../types/agentTypes";
import { AgentCategory } from "../AgentCategoryFilters"; // Import AgentCategory type

// Use URLs for public assets instead of importing them directly
const femaleDoctorScrubs = '/agents/female-doctor-scrubs.jpg';
const maleDoctorLabcoat = '/agents/male-doctor-labcoat.jpg';
const femaleSurgeonCap = '/agents/female-surgeon-cap.jpg';
const placeholderSvg = '/placeholder.svg';

// Helper function to generate simple IDs
const generateId = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
};

// Helper function to split tasks into description and capabilities
const processTasks = (tasks: string): { description: string; capabilities: string[] } => {
    const sentences = tasks.split('. ').filter(s => s.trim() !== '');
    const description = sentences[0] || tasks; // Use first sentence or full text
    // Split by common delimiters like commas or 'and' within the first sentence for capabilities, or use all sentences
    let capabilities = sentences; 
    if (sentences.length === 1) {
        capabilities = description.split(/, | and /);
    }
    return { description: description + (description.endsWith('.') ? '' : '.'), capabilities: capabilities.map(c => c.trim().replace(/\.$/, '')) };
};

// Placeholder colors and icons
const defaultIcon = Bot;
const colors = [
    "red-500", "orange-500", "amber-500", "yellow-500", "lime-500", 
    "green-500", "emerald-500", "teal-500", "cyan-500", "sky-500", 
    "blue-500", "indigo-500", "violet-500", "purple-500", "fuchsia-500", 
    "pink-500", "rose-500"
];
let colorIndex = 0;
const getNextColor = () => colors[colorIndex++ % colors.length];

// Existing Agents - Enhanced with personality traits
const existingAgents: Agent[] = [
  {
    id: "cardio", name: "CardioAssist", specialty: "Cardiology", 
    description: "Expert in cardiovascular conditions and treatments.", icon: Heart, category: 'general' as 'general',
    capabilities: ["ECG analysis and interpretation", "Cardiovascular risk assessment", "Treatment recommendations for heart conditions", "Post-operative monitoring guidance"],
    imageUrl: femaleDoctorScrubs, rating: 'New', // Use imported image
    // Personality-driven properties
    personality: "Passionate and rhythmic, with a focus on cardiovascular dynamics",
    speechPattern: "Uses heart metaphors and emphasizes flow and circulation",
    gradientColors: "from-red-400 to-red-600",
    animationStyle: "heartbeat",
    color: "#d93025"
  },
  {
    id: "neuro", name: "NeuroLogic", specialty: "Neurology", 
    description: "Specialist in neurological disorders and brain function.", icon: Brain, category: 'general' as 'general',
    capabilities: ["Neurological symptom analysis", "MRI and CT scan preliminary review", "Neurological treatment recommendations", "Stroke assessment protocols"],
    imageUrl: maleDoctorLabcoat, rating: 'New', // Use imported image
    // Personality-driven properties
    personality: "Detail-oriented and analytical, with a keen eye for subtle patterns",
    speechPattern: "Structured observations with precise terminology and logical connections",
    gradientColors: "from-purple-400 to-indigo-600",
    animationStyle: "pulse",
    color: "#6366f1"
  },
  {
    id: "path", name: "PathInsight", specialty: "Pathology", 
    description: "Analysis of lab results and diagnostic findings.", icon: Microscope, category: 'research' as AgentCategory,
    capabilities: ["Laboratory test analysis", "Pathology report interpretation", "Diagnostic testing recommendations", "Tissue sample preliminary assessment"],
    imageUrl: femaleSurgeonCap, rating: 'New', // Use imported image
    // Personality-driven properties
    personality: "Methodical and evidence-based, with a focus on cellular details",
    speechPattern: "Structured observations moving from microscopic to diagnostic conclusions",
    gradientColors: "from-purple-400 to-purple-600",
    animationStyle: "pulse",
    color: "#a142f5"
  },
  {
    id: "gen", name: "GeneralMD", specialty: "General Medicine", 
    description: "Comprehensive primary care expertise.", icon: Stethoscope, category: 'general' as 'general',
    capabilities: ["General health assessments", "Preventive care recommendations", "Common illness diagnosis assistance", "Patient education materials"],
    imageUrl: placeholderSvg, rating: parseFloat((4.7 + Math.random() * 0.3).toFixed(1)), // Use imported image
    // Personality-driven properties
    personality: "Compassionate and thorough, with a focus on holistic treatment approaches",
    speechPattern: "Balances technical terms with patient-friendly explanations",
    gradientColors: "from-blue-400 to-blue-600",
    animationStyle: "pulse",
    color: "#4287f5"
  },
  {
    id: "opth", name: "OptiVision", specialty: "Ophthalmology", 
    description: "Expert in eye conditions and treatments.", icon: Eye, category: 'general' as 'general',
    capabilities: ["Vision test interpretation", "Eye disease assessment", "Treatment recommendations for eye conditions", "Post-operative care guidance"],
    imageUrl: placeholderSvg, rating: parseFloat((4.7 + Math.random() * 0.3).toFixed(1)), // Use imported image
    // Personality-driven properties
    personality: "Precise and observant, with attention to visual details",
    speechPattern: "Visual descriptions with clarity and focus on perceptual elements",
    gradientColors: "from-cyan-400 to-blue-500",
    animationStyle: "pulse",
    color: "#42c5f5"
  },
  {
    id: "radiology", name: "RadAnalytics", specialty: "Radiology", 
    description: "Interpretation of medical imaging.", icon: BarChart4, category: 'research' as AgentCategory,
    capabilities: ["X-ray preliminary analysis", "CT scan review assistance", "MRI interpretation support", "Imaging protocol recommendations"],
    imageUrl: placeholderSvg, rating: parseFloat((4.7 + Math.random() * 0.3).toFixed(1)), // Use imported image
    // Personality-driven properties
    personality: "Detail-oriented and analytical, with a keen eye for subtle findings",
    speechPattern: "Visual descriptions with precise measurements and comparisons",
    gradientColors: "from-green-400 to-emerald-500",
    animationStyle: "pulse",
    color: "#42f59e"
  },
  {
    id: "pharma", name: "PharmExpert", specialty: "Pharmacology", 
    description: "Medication advice and drug interactions.", icon: Pill, category: 'general' as 'general',
    capabilities: ["Drug interaction checking", "Medication regimen review", "Dosage adjustment recommendations", "Side effect management advice"],
    imageUrl: placeholderSvg, rating: parseFloat((4.7 + Math.random() * 0.3).toFixed(1)), // Use imported image
    // Personality-driven properties
    personality: "Precise and calculated, with a focus on medication safety",
    speechPattern: "Technical terminology balanced with clear treatment rationales",
    gradientColors: "from-pink-400 to-pink-600",
    animationStyle: "pulse",
    color: "#f542c8"
  },
];

// New Agent Data (Parsed) - Original structure
const newAgentData = [
  { name: "CardioInsight AI", specialty: "Cardiology", tasks: "Identifies cardiac abnormalities from ECGs, analyzes symptoms indicative of cardiovascular conditions.", icon: HeartPulse, category: 'general' as 'general' },
  { name: "NeuroSense AI", specialty: "Neurology", tasks: "Evaluates neurological symptoms, assists in identifying conditions such as stroke, epilepsy, and Parkinson's disease.", icon: BrainCircuit, category: 'general' as 'general' },
  { name: "OncoDetect AI", specialty: "Oncology", tasks: "Assists in early detection of various cancers, analyzes biopsy and imaging data.", icon: SearchCheck, category: 'research' as AgentCategory },
  { name: "PulmoAid AI", specialty: "Pulmonology", tasks: "Diagnoses respiratory diseases including COPD, asthma, and pneumonia based on patient symptoms and imaging.", icon: Wind, category: 'general' as 'general' },
  { name: "EndoCare AI", specialty: "Endocrinology", tasks: "Manages endocrine disorders like diabetes, thyroid dysfunction, and hormonal imbalances through symptom analysis and blood tests.", icon: Droplet, category: 'general' as 'general' },
  { name: "DermalView AI", specialty: "Dermatology", tasks: "Identifies skin conditions using image analysis, assists in diagnosing conditions like melanoma, psoriasis, and dermatitis.", icon: ScanFace, category: 'general' as 'general' },
  { name: "GastroCheck AI", specialty: "Gastroenterology", tasks: "Evaluates gastrointestinal symptoms and assists in diagnosing conditions like IBS, Crohn's disease, and GERD.", icon: Activity, category: 'general' as 'general' }, 
  { name: "NephroTrack AI", specialty: "Nephrology", tasks: "Monitors kidney function, identifies renal diseases and abnormalities from lab tests and patient history.", icon: Activity, category: 'general' as 'general' }, 
  { name: "PediaCare AI", specialty: "Pediatrics", tasks: "Specializes in pediatric diagnostics including growth disorders, childhood infections, and developmental concerns.", icon: HelpingHand, category: 'general' as 'general' },
  { name: "PsychAssist AI", specialty: "Psychiatry", tasks: "Assists in diagnosing mental health disorders like depression, anxiety, and bipolar disorder through behavioral analysis.", icon: MessageSquare, category: 'general' as 'general' },
  { name: "RheumaDetect AI", specialty: "Rheumatology", tasks: "Evaluates symptoms of autoimmune and inflammatory conditions, such as rheumatoid arthritis and lupus.", icon: Bone, category: 'general' as 'general' },
  { name: "ImmunoSense AI", specialty: "Immunology", tasks: "Detects immune system disorders and allergies, provides diagnostic insights based on immune response tests.", icon: ShieldAlert, category: 'research' as AgentCategory },
  { name: "OphthalmoInsight AI", specialty: "Ophthalmology", tasks: "Diagnoses eye conditions, including glaucoma, macular degeneration, and diabetic retinopathy through retinal scans.", icon: Eye, category: 'general' as 'general' }, 
  { name: "HemaGuard AI", specialty: "Hematology", tasks: "Assists in diagnosing blood disorders like anemia, leukemia, and clotting disorders through blood work analysis.", icon: TestTubeDiagonal, category: 'research' as AgentCategory },
  { name: "OrthoAssist AI", specialty: "Orthopedics", tasks: "Identifies orthopedic conditions including fractures, arthritis, and musculoskeletal disorders using imaging and physical examination data.", icon: Bone, category: 'general' as 'general' }, 
  { name: "UroCare AI", specialty: "Urology", tasks: "Diagnoses conditions such as urinary tract infections, prostate issues, and kidney stones.", icon: Activity, category: 'general' as 'general' }, 
  { name: "GynecoAssist AI", specialty: "Gynecology", tasks: "Identifies reproductive health issues, assists in diagnosing conditions like PCOS and endometriosis.", icon: Users, category: 'general' as 'general' }, 
  { name: "InfectioSense AI", specialty: "Infectious Diseases", tasks: "Diagnoses bacterial, viral, fungal, and parasitic infections using symptom analysis and laboratory results.", icon: FlaskConical, category: 'research' as AgentCategory },
  { name: "ENTDiagnose AI", specialty: "Otolaryngology (ENT)", tasks: "Evaluates and diagnoses conditions related to ear, nose, and throat, including sinus infections and hearing loss.", icon: Activity, category: 'general' as 'general' }, 
  { name: "AllerGuard AI", specialty: "Allergy and Immunology", tasks: "Identifies allergens and allergic reactions, provides insights into effective treatment strategies.", icon: ShieldAlert, category: 'general' as 'general' }, 
  { name: "VascuSense AI", specialty: "Vascular Surgery", tasks: "Diagnoses conditions involving blood vessels such as varicose veins, aneurysms, and peripheral artery disease.", icon: Activity, category: 'general' as 'general' }, 
  { name: "GenetiCare AI", specialty: "Genetics", tasks: "Provides genetic screening analysis, identifies hereditary conditions and genetic risk factors.", icon: Dna, category: 'research' as AgentCategory },
  { name: "PainManage AI", specialty: "Pain Management", tasks: "Evaluates chronic pain conditions, helps identify sources of pain, and suggests personalized treatment plans.", icon: HandHeart, category: 'general' as 'general' },
  { name: "SportsMed AI", specialty: "Sports Medicine", tasks: "Assists in diagnosis and management of sports-related injuries, from muscle strains to concussions.", icon: Activity, category: 'general' as 'general' }, 
  { name: "RehabTrack AI", specialty: "Rehabilitation Medicine", tasks: "Monitors patient recovery post-injury or surgery, provides tailored rehabilitation plans.", icon: Recycle, category: 'general' as 'general' },
  { name: "IntervenCardio AI", specialty: "Interventional Cardiology", tasks: "Assists in interpreting cardiac catheterization data and managing post-procedural care.", icon: HeartPulse, category: 'general' as 'general' }, 
  { name: "PediaOnco AI", specialty: "Pediatric Oncology", tasks: "Supports diagnosis and treatment planning for childhood cancers using pediatric-specific data.", icon: HelpingHand, category: 'research' as AgentCategory }, 
  { name: "NeuroOnco AI", specialty: "Neuro-Oncology", tasks: "Analyzes brain scans and neurological symptoms to assist in diagnosing and managing brain tumors.", icon: BrainCircuit, category: 'research' as AgentCategory }, 
  { name: "ReproEndo AI", specialty: "Reproductive Endocrinology", tasks: "Assists in diagnosing and treating hormonal disorders related to fertility and reproductive health.", icon: Users, category: 'general' as 'general' }, 
  { name: "GeriatraCare AI", specialty: "Geriatric Medicine", tasks: "Focuses on age-related health concerns, including polypharmacy, cognitive decline, and chronic disease management.", icon: UserCheck, category: 'general' as 'general' },
  { name: "NutritionCare AI", specialty: "Nutrition", tasks: "Generates dietary plans, identifies nutritional deficiencies, and supports patient wellness goals.", icon: Activity, category: 'general' as 'general' }, 
  { name: "SpeechTherapy AI", specialty: "Speech Therapy", tasks: "Assists in planning and tracking speech-language therapy for neurological and developmental cases.", icon: Speech, category: 'general' as 'general' },
  { name: "OccupationalTherapy AI", specialty: "Occupational Therapy", tasks: "Helps design rehabilitation routines for patients recovering from surgery, injury, or chronic conditions.", icon: PersonStanding, category: 'general' as 'general' },
  { name: "PharmaAdvisor AI", specialty: "Pharmacy", tasks: "Provides medication reviews, flags potential interactions, and ensures compliance with treatment regimens.", icon: Pill, category: 'general' as 'general' }, 
  { name: "SocialCare AI", specialty: "Social Work", tasks: "Assists patients with navigating healthcare systems, insurance, and accessing support resources.", icon: Briefcase, category: 'general' as 'general' },
  { name: "BillingCode AI", specialty: "Medical Billing and Coding", tasks: "Generates CPT and ICD codes from clinical documentation for accurate billing.", icon: FileQuestion, category: 'general' as 'general' },
  { name: "ConsentPrep AI", specialty: "Patient Consent Documentation", tasks: "Drafts patient consent forms tailored to procedures, risks, and compliance needs.", icon: ClipboardCheck, category: 'general' as 'general' },
  { name: "ReferralManager AI", specialty: "Referral Coordination", tasks: "Prepares referral letters, gathers relevant medical documents, and manages specialist scheduling.", icon: FolderKanban, category: 'general' as 'general' },
  { name: "LegalScreen AI", specialty: "Medical-Legal Compliance", tasks: "Reviews documentation for HIPAA compliance and potential legal risks.", icon: ShieldCheck, category: 'general' as 'general' },
  { name: "ClinicalTrialMatch AI", specialty: "Clinical Research", tasks: "Matches patients to active clinical trials based on diagnosis, history, and eligibility criteria.", icon: FileSearch, category: 'research' as AgentCategory }
];

// Map new data to Agent structure - Re-add imageUrl and rating
const newAgents: Agent[] = newAgentData.map((agentInfo, index) => {
    const { description, capabilities } = processTasks(agentInfo.tasks);
    const isNewAgent = index < 3; // Consider first 3 of the *new* list as new for rating example
    
    // Base agent object
    const agent: Agent = {
        id: generateId(agentInfo.name),
        name: agentInfo.name,
        specialty: agentInfo.specialty,
        description: description,
        icon: agentInfo.icon || defaultIcon,
        capabilities: capabilities.slice(0, 4),
        category: agentInfo.category || 'general',
        imageUrl: placeholderSvg, // Use imported placeholder for new agents
        rating: isNewAgent ? 'New' : parseFloat((4.7 + Math.random() * 0.3).toFixed(1))
    };
    
    // Add personality-driven properties based on specialty
    if (agentInfo.specialty === "Pulmonology") {
        // Softer, more readable colors for Pulmonology
        agent.personality = "Calm and methodical, with a focus on respiratory patterns";
        agent.speechPattern = "Clear explanations with breathing metaphors and measured pacing";
        agent.gradientColors = "from-blue-200 to-blue-400"; // Lighter, more readable blue gradient
        agent.animationStyle = "breathe";
        agent.color = "#6da4d1"; // Softer blue color
    } else if (agentInfo.specialty === "Cardiology") {
        agent.personality = "Energetic and precise, with a focus on cardiac rhythms";
        agent.speechPattern = "Rhythmic explanations with heart-related metaphors";
        agent.gradientColors = "from-red-300 to-red-500";
        agent.animationStyle = "heartbeat";
        agent.color = "#e05252";
    } else if (agentInfo.specialty === "Neurology") {
        agent.personality = "Thoughtful and analytical, with attention to neural connections";
        agent.speechPattern = "Structured explanations with neural network metaphors";
        agent.gradientColors = "from-purple-300 to-indigo-500";
        agent.animationStyle = "pulse";
        agent.color = "#8a63d2";
    } else if (agentInfo.specialty === "Oncology") {
        agent.personality = "Compassionate and thorough, with a focus on precision";
        agent.speechPattern = "Careful explanations with emphasis on detection and treatment";
        agent.gradientColors = "from-amber-200 to-amber-400";
        agent.animationStyle = "pulse";
        agent.color = "#d4a72c";
    }
    
    return agent;
});

// Combine existing and new agents
export const agents: Agent[] = [...existingAgents, ...newAgents];
