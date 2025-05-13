// Mock: mockAIResponse
// Purpose: Provides mock AI responses for testing and development purposes, with a fallback to a structured medical response format.
// Used in: agentService.

// AI response generator for the application
// This file provides responses for the DeepSeek AI provider

import {
  DEFAULT_MODEL,
  generateDeepSeekResponse as callDeepSeekAPI,
  isDeepSeekConfigured
} from '../integrations/deepseek/client';

export const generateMockResponse = async (prompt: string, provider: 'deepseek' = 'deepseek'): Promise<string> => {
  // Create a structured response based on the provider
  return await generateDeepSeekResponse(prompt);
};

const generateDeepSeekResponse = async (prompt: string): Promise<string> => {
  // Check if DeepSeek API is configured
  if (isDeepSeekConfigured()) {
    try {
      // Format the medical prompt to get a structured response
      const formattedPrompt = `You are a medical AI assistant. Please respond to the following question in a structured format with QUESTION, DIAGNOSIS/ANALYSIS, SUMMARY, and REFERENCES sections:\n\n${prompt}`;
      
      // Call the real DeepSeek API
      const response = await callDeepSeekAPI({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable medical assistant providing evidence-based information for healthcare professionals. Structure your responses with sections for Question, Diagnosis/Analysis, Summary, and References.'
          },
          {
            role: 'user',
            content: formattedPrompt
          }
        ],
        temperature: 0.3, // Lower temperature for more focused, factual responses
        max_tokens: 2048
      });
      
      // Return the assistant's response
      return response.choices[0].message.content as string;
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      // Fall back to mock response if the API call fails
      return fallbackDeepSeekResponse(prompt);
    }
  } else {
    // If API key is not configured, fall back to mock response
    console.warn('DeepSeek API key not configured, using mock response');
    return fallbackDeepSeekResponse(prompt);
  }
};

// Fallback mock responses when the API is not available
const fallbackDeepSeekResponse = (prompt: string): string => {
  // Check for specific conditions in the prompt
  if (prompt.toLowerCase().includes('brucellosis')) {
    return `QUESTION:
What is the treatment for brucellosis?

DIAGNOSIS/ANALYSIS:
**Brucellosis** is a bacterial zoonotic infection caused by various species of the genus Brucella. It's transmitted to humans through direct contact with infected animals, consumption of contaminated animal products (particularly unpasteurized dairy), or inhalation of aerosolized particles [1]. The disease can present with acute, subacute, or chronic manifestations, making proper treatment essential to prevent complications and relapse.

The treatment of brucellosis typically involves a **combination antibiotic approach** to effectively eradicate the intracellular bacteria. Single-agent therapy is associated with high relapse rates (up to 40%), which is why combination regimens are strongly recommended by international guidelines [2].

The **first-line treatment** for uncomplicated brucellosis in adults and children over 8 years of age consists of **doxycycline (100 mg twice daily) combined with rifampicin (600-900 mg once daily)** for a minimum duration of **6 weeks** [1,3]. This regimen has shown efficacy rates of 70-85% with relapse rates of approximately 5-10% [2].

For complicated brucellosis cases involving focal disease such as endocarditis, neurobrucellosis, or spondylitis, a **triple-drug regimen** is recommended. This typically includes **doxycycline, rifampicin, and an aminoglycoside (streptomycin or gentamicin)** for an extended period of 3-6 months, depending on clinical response [3,4].

SUMMARY:
1. First-line treatment for uncomplicated brucellosis: Doxycycline (100 mg twice daily) + rifampicin (600-900 mg once daily) for 6 weeks [1,3].
2. For complicated brucellosis: Triple therapy with doxycycline, rifampicin, and an aminoglycoside for 3-6 months [3,4].
3. For pregnant women and children under 8: Trimethoprim-sulfamethoxazole + rifampicin for 6 weeks [2].
4. Regular monitoring is essential to assess treatment response and detect potential relapse [4].

REFERENCES:
1. World Health Organization. Brucellosis in humans and animals. WHO guidance. Geneva: World Health Organization; 2020.
2. Ariza J, Bosilkovski M, Cascio A, et al. Perspectives for the treatment of brucellosis in the 21st century: the Ioannina recommendations. PLoS Medicine. 2019;16(12):e1003013.
3. Hasanjani Roushan MR, Ebrahimpour S. Human brucellosis: An overview. Caspian Journal of Internal Medicine. 2015;6(1):46-57.
4. Skalsky K, Yahav D, Bishara J, et al. Treatment of human brucellosis: systematic review and meta-analysis of randomised controlled trials. BMJ. 2008;336(7646):701-704.`;
  } else if (prompt.toLowerCase().includes('diabetes')) {
    return `QUESTION:
What is the treatment for diabetes?

DIAGNOSIS/ANALYSIS:
The treatment of **diabetes mellitus** varies based on the type of diabetes, individual patient factors, comorbidities, and treatment goals. The primary objective is to achieve glycemic control while preventing complications and maintaining quality of life [1].

For **Type 1 Diabetes (T1D)**, which is characterized by autoimmune destruction of pancreatic beta cells and absolute insulin deficiency:

- **Insulin therapy** is the cornerstone of treatment and is life-sustaining. Multiple daily injections (MDI) with basal-bolus regimens or continuous subcutaneous insulin infusion (insulin pump therapy) are the standard approaches [1].
- **Carbohydrate counting** and insulin dose adjustment based on pre-meal glucose levels, anticipated carbohydrate intake, and physical activity are essential components of management [2].
- **Continuous glucose monitoring (CGM)** systems are increasingly recommended to improve glycemic control and reduce hypoglycemia risk [2].
- **Automated insulin delivery systems** (hybrid closed-loop systems) that automatically adjust basal insulin delivery based on CGM readings are now available and show promising results [3].

For **Type 2 Diabetes (T2D)**, which is characterized by insulin resistance and progressive beta-cell dysfunction:

- **Lifestyle modifications** including medical nutrition therapy, regular physical activity (150 minutes/week of moderate-intensity exercise), and weight management form the foundation of treatment [1].
- **Metformin** is typically the first-line pharmacologic agent due to its efficacy, safety, and cost-effectiveness [1].
- **Second-line agents** are selected based on patient-specific factors and include:
  - **Sodium-glucose cotransporter-2 (SGLT2) inhibitors** (empagliflozin, canagliflozin, dapagliflozin)
  - **Glucagon-like peptide-1 receptor agonists (GLP-1 RAs)** (semaglutide, dulaglutide, liraglutide)
  - **Dipeptidyl peptidase-4 (DPP-4) inhibitors** (sitagliptin, linagliptin)
  - **Thiazolidinediones** (pioglitazone)
  - **Sulfonylureas** (glimepiride, glipizide)
  - **Insulin therapy** (when other agents fail to achieve glycemic targets) [4]

SUMMARY:
1. Type 1 Diabetes: Insulin therapy (MDI or pump), carbohydrate counting, glucose monitoring, and automated insulin delivery systems [1,2,3].
2. Type 2 Diabetes: Lifestyle modifications and pharmacologic therapy starting with metformin, followed by patient-specific second-line agents [1,4].
3. For patients with cardiovascular disease or high CV risk: SGLT2 inhibitors or GLP-1 RAs with proven CV benefit [4].
4. For diabetic kidney disease: SGLT2 inhibitors to reduce CKD progression [4].
5. Comprehensive care includes regular screening for complications, cardiovascular risk reduction, and patient education [1].

REFERENCES:
1. American Diabetes Association Professional Practice Committee. Standards of Medical Care in Diabetes—2023. Diabetes Care. 2023;46(Supplement 1):S1-S280.
2. DiMeglio LA, Evans-Molina C, Oram RA. Type 1 diabetes. Lancet. 2018;391(10138):2449-2462.
3. Brown SA, Kovatchev BP, Raghinaru D, et al. Six-Month Randomized, Multicenter Trial of Closed-Loop Control in Type 1 Diabetes. N Engl J Med. 2019;381(18):1707-1717.
4. Davies MJ, Aroda VR, Collins BS, et al. Management of Hyperglycemia in Type 2 Diabetes, 2022. A Consensus Report by the American Diabetes Association (ADA) and the European Association for the Study of Diabetes (EASD). Diabetes Care. 2022;45(11):2753-2786.`;
  } else {
    // Default response for other queries
    return `QUESTION:
${prompt}

DIAGNOSIS/ANALYSIS:
I don't have specific information about "${prompt}" in my current knowledge base. This appears to be a medical question that would require specialized knowledge and up-to-date research.

For accurate and reliable medical information, I recommend:

1. **Consulting with a qualified healthcare professional** who can provide personalized advice based on your specific medical history and current condition.

2. **Reviewing recent medical literature** from reputable sources such as:
   - The British Medical Journal (BMJ)
   - The New England Journal of Medicine (NEJM)
   - The Lancet
   - JAMA (Journal of the American Medical Association)

3. **Checking evidence-based clinical guidelines** from organizations such as:
   - National Institute for Health and Care Excellence (NICE)
   - World Health Organization (WHO)
   - Centers for Disease Control and Prevention (CDC)
   - Relevant specialty medical societies

SUMMARY:
1. Consult with a qualified healthcare professional for personalized advice.
2. Review recent medical literature from reputable journals for current evidence.
3. Check clinical guidelines from trusted medical organizations.
4. Be cautious of outdated or unverified medical information online.

REFERENCES:
1. Smith J, et al. Evaluating the Quality of Online Health Information: A Systematic Review. Journal of Medical Internet Research. 2020;22(5):e17324.
2. Greenhalgh T. How to Read a Paper: The Basics of Evidence-Based Medicine. BMJ Books; 2019.`;
  }
};
