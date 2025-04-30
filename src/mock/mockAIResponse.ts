// Mock AI response generator for testing
// This file provides mock responses for both Gemini and DeepSeek AI providers

export const generateMockResponse = (prompt: string, provider: 'gemini' | 'deepseek' = 'gemini'): string => {
  // Create a structured response based on the provider
  if (provider === 'deepseek') {
    return generateDeepSeekResponse(prompt);
  } else {
    return generateGeminiResponse(prompt);
  }
};

const generateGeminiResponse = (prompt: string): string => {
  // Check for specific conditions in the prompt
  if (prompt.toLowerCase().includes('brucellosis')) {
    return `QUESTION:
What is the treatment for brucellosis?

DIAGNOSIS/ANALYSIS:
**Brucellosis** is a bacterial infection caused by various species of the genus Brucella. It's primarily a zoonotic disease, meaning it's transmitted from animals to humans, typically through consumption of unpasteurized dairy products or direct contact with infected animals [1]. The treatment of brucellosis requires a combination of antibiotics to effectively eradicate the bacteria and prevent relapse.

The **first-line treatment** for uncomplicated brucellosis is a combination of **doxycycline and rifampicin for at least 6 weeks** [1]. This regimen is recommended by the Centers for Disease Control and Prevention (CDC) and the World Health Organization (WHO) due to its efficacy in clearing the infection and preventing relapse [2].

For more complicated cases of brucellosis, such as those involving endocarditis, meningitis, or osteomyelitis, the treatment regimen should be extended and may include an aminoglycoside. Specifically, a combination of **doxycycline, rifampicin, and an aminoglycoside (such as streptomycin or gentamicin)** is recommended, with the duration of therapy extended to 4-6 months [1].

SUMMARY:
1. Uncomplicated brucellosis: Doxycycline and rifampicin for ≥6 weeks [1].
2. Complicated brucellosis: Doxycycline, rifampicin, and an aminoglycoside for 4-6 months [1].
3. Alternative regimens such as doxycycline plus trimethoprim-sulfamethoxazole or doxycycline plus quinolones may be considered in specific patient populations [3-4].

REFERENCES:
1. Brucellosis: Diagnosis, Treatment, and Management. Centers for Disease Control and Prevention. 2021.
2. Antibiotics for Treating Human Brucellosis. Yousefi-Nooraie R, et al. The Cochrane Database of Systematic Reviews. 2012;10:CD007179.
3. Treatment of Human Brucellosis: Systematic Review and Meta-Analysis of Randomised Controlled Trials. Skalsky K, et al. BMJ. 2008;336:701-704.
4. Brucellosis: A Worldwide Zoonosis. Pappas G, et al. Current Opinion in Infectious Diseases. 2006;19:272-279.`;
  } else if (prompt.toLowerCase().includes('asthma')) {
    return `QUESTION:
What is the treatment for asthma?

DIAGNOSIS/ANALYSIS:
Asthma is a chronic respiratory condition characterized by airway inflammation, hyperresponsiveness, and variable airflow obstruction. The treatment for asthma involves a stepwise approach tailored to the severity of the disease and individual patient factors. The primary goals of asthma management are to control symptoms, reduce the risk of exacerbations, and minimize adverse effects of medications [1].

For **mild asthma**, the preferred treatment is an **inhaled glucocorticoid–formoterol combination as needed**. Alternative options include the use of combination inhaled glucocorticoid–albuterol as needed or low-dose maintenance inhaled glucocorticoid plus a short-acting β2-agonist (SABA) reliever as needed [1].

For **moderate-to-severe asthma**, the preferred treatment is **single maintenance and reliever therapy (SMART)** with a low- or medium-dose inhaled glucocorticoid–formoterol combination (either budesonide–formoterol or beclomethasone–formoterol). This regimen simplifies treatment by using one inhaler for both quick-relief and maintenance therapy. Alternative treatments include maintenance low- or medium-dose inhaled glucocorticoid–long-acting β2-agonist (LABA) plus as-needed SABA or as-needed combination inhaled glucocorticoid–SABA [1].

For **severe asthma** that remains uncontrolled despite high-dose inhaled glucocorticoid–LABA therapy, additional controller medications may be considered. These include **long-acting muscarinic antagonists (LAMAs)** such as tiotropium, **leukotriene receptor antagonists (LTRAs)** such as montelukast, and **biologic therapies** targeting specific inflammatory pathways [2].

SUMMARY:
1. Mild asthma: Inhaled glucocorticoid–formoterol as needed or low-dose maintenance inhaled glucocorticoid plus SABA as needed [1].
2. Moderate-to-severe asthma: SMART with inhaled glucocorticoid–formoterol or maintenance inhaled glucocorticoid–LABA plus as-needed SABA [1].
3. Severe uncontrolled asthma: Consider adding LAMAs, LTRAs, or biologic therapies based on specific phenotypes [2].
4. Non-pharmacologic management includes asthma education, trigger avoidance, regular physical activity, weight management, and smoking cessation [4].

REFERENCES:
1. Global Initiative for Asthma. Global Strategy for Asthma Management and Prevention, 2023 Update.
2. Holguin F, Cardet JC, Chung KF, et al. Management of Severe Asthma: a European Respiratory Society/American Thoracic Society Guideline. Eur Respir J. 2020;55(1):1900588.
3. Menzies-Gow A, Canonica GW, Winders TA, et al. A Charter to Improve Patient Care in Severe Asthma. Adv Ther. 2018;35(10):1485-1496.
4. Cloutier MM, Baptist AP, Blake KV, et al. 2020 Focused Updates to the Asthma Management Guidelines: A Report from the National Asthma Education and Prevention Program Coordinating Committee Expert Panel Working Group. J Allergy Clin Immunol. 2020;146(6):1217-1270.`;
  } else if (prompt.toLowerCase().includes('pneumonia')) {
    return `QUESTION:
What is the treatment for pneumonia?

DIAGNOSIS/ANALYSIS:
**Pneumonia** is an infection that inflames the air sacs in one or both lungs, which may fill with fluid or pus. The infection can be caused by various pathogens, including bacteria, viruses, and fungi [1]. The treatment approach depends on the type of pneumonia, the causative pathogen, the severity of symptoms, and patient factors such as age and comorbidities.

For **bacterial pneumonia**, which is the most common type requiring specific treatment, **antibiotics** are the mainstay of therapy [1]. The choice of antibiotic depends on several factors, including whether the pneumonia is community-acquired (CAP) or hospital-acquired (HAP), the suspected pathogen, and local resistance patterns [2].

For **mild to moderate community-acquired pneumonia** in otherwise healthy adults, oral antibiotics such as **amoxicillin, doxycycline, or a macrolide** (azithromycin or clarithromycin) are typically recommended as first-line treatments [2]. For patients with comorbidities or risk factors for drug-resistant pathogens, a **respiratory fluoroquinolone** (levofloxacin or moxifloxacin) or a **beta-lactam plus a macrolide** combination may be more appropriate [3].

For **severe pneumonia** requiring hospitalization, **intravenous antibiotics** are typically initiated. Common regimens include a **beta-lactam (such as ceftriaxone) plus a macrolide or a respiratory fluoroquinolone** [3]. For patients with risk factors for Pseudomonas aeruginosa, an **antipseudomonal beta-lactam** (piperacillin-tazobactam, cefepime, meropenem, or imipenem) plus either a fluoroquinolone or an aminoglycoside is recommended [2].

SUMMARY:
1. Mild to moderate community-acquired pneumonia: Oral antibiotics such as amoxicillin, doxycycline, or a macrolide for 5-7 days [2].
2. Severe community-acquired pneumonia: Intravenous beta-lactam plus either a macrolide or a respiratory fluoroquinolone [3].
3. Hospital-acquired pneumonia: Broader-spectrum antibiotics based on local resistance patterns and patient risk factors [4].
4. Supportive care including adequate hydration, oxygen therapy if needed, and antipyretics for fever is essential for all patients with pneumonia [1].

REFERENCES:
1. Pneumonia Diagnosis and Treatment. Mayo Clinic. 2021.
2. Metlay JP, Waterer GW, Long AC, et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. An Official Clinical Practice Guideline of the American Thoracic Society and Infectious Diseases Society of America. Am J Respir Crit Care Med. 2019;200(7):e45-e67.
3. National Institute for Health and Care Excellence (NICE). Pneumonia in adults: diagnosis and management. Clinical guideline [CG191]. 2019.
4. Kalil AC, Metersky ML, Klompas M, et al. Management of Adults With Hospital-acquired and Ventilator-associated Pneumonia: 2016 Clinical Practice Guidelines by the Infectious Diseases Society of America and the American Thoracic Society. Clin Infect Dis. 2016;63(5):e61-e111.`;
  } else {
    // Default response for other queries
    return `QUESTION:
${prompt}

DIAGNOSIS/ANALYSIS:
I don't have specific information about "${prompt}" in my knowledge base. This appears to be a medical question that would require specialized knowledge.

For accurate medical information, I recommend:

1. **Consulting with a healthcare professional** who can provide personalized advice based on your specific situation.

2. **Checking reputable medical sources** such as:
   - Mayo Clinic (mayoclinic.org)
   - National Institutes of Health (nih.gov)
   - Centers for Disease Control and Prevention (cdc.gov)
   - World Health Organization (who.int)

3. **Speaking with a specialist** if this relates to a specific medical condition you're experiencing.

Medical information should be accurate, up-to-date, and personalized to your situation, which is why direct consultation with healthcare providers is always the best approach for medical questions.

SUMMARY:
1. Consult with a healthcare professional for personalized advice.
2. Check reputable medical sources for general information.
3. Speak with a specialist for condition-specific guidance.

REFERENCES:
1. Medical Information on the Internet. National Library of Medicine. 2022.
2. Evaluating Health Information. MedlinePlus. 2021.`;
  }
};

const generateDeepSeekResponse = (prompt: string): string => {
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
