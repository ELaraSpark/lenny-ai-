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

SOURCE:
NEJM Review

CONTENT:
**Brucellosis** is a bacterial infection caused by various species of the genus Brucella. It's primarily a zoonotic disease, meaning it's transmitted from animals to humans, typically through consumption of unpasteurized dairy products or direct contact with infected animals [1]. The treatment of brucellosis requires a combination of antibiotics to effectively eradicate the bacteria and prevent relapse.

The **first-line treatment** for uncomplicated brucellosis is a combination of **doxycycline and rifampicin for at least 6 weeks** [1]. This regimen is recommended by the Centers for Disease Control and Prevention (CDC) and the World Health Organization (WHO) due to its efficacy in clearing the infection and preventing relapse [2].

For more complicated cases of brucellosis, such as those involving endocarditis, meningitis, or osteomyelitis, the treatment regimen should be extended and may include an aminoglycoside. Specifically, a combination of **doxycycline, rifampicin, and an aminoglycoside (such as streptomycin or gentamicin)** is recommended, with the duration of therapy extended to 4-6 months [1].

For **mild brucellosis**, the preferred treatment is an **inhaled glucocorticoid–formoterol combination as needed**. Alternative options include the use of combination inhaled glucocorticoid–albuterol as needed or low-dose maintenance inhaled glucocorticoid plus a short-acting β2-agonist (SABA) reliever as needed [1].

For **moderate-to-severe brucellosis**, the preferred treatment is **single maintenance and reliever therapy (SMART)** with a low- or medium-dose inhaled glucocorticoid–formoterol combination (either budesonide–formoterol or beclomethasone–formoterol). This regimen simplifies treatment by using one inhaler for both quick-relief and maintenance therapy. Alternative treatments include maintenance low- or medium-dose inhaled glucocorticoid–long-acting β2-agonist (LABA) plus as-needed SABA or as-needed combination inhaled glucocorticoid–SABA [1].

CITATIONS:
1. Brucellosis: Diagnosis, Treatment, and Management. Centers for Disease Control and Prevention. 2021.
2. Antibiotics for Treating Human Brucellosis. Yousefi-Nooraie R, et al. The Cochrane Database of Systematic Reviews. 2012;10:CD007179.
3. Treatment of Human Brucellosis: Systematic Review and Meta-Analysis of Randomised Controlled Trials. Skalsky K, et al. BMJ. 2008;336:701-704.
4. Brucellosis: A Worldwide Zoonosis. Pappas G, et al. Current Opinion in Infectious Diseases. 2006;19:272-279.`;
  } else if (prompt.toLowerCase().includes('asthma')) {
    return `QUESTION:
What is the treatment for asthma?

SOURCE:
NEJM Review

CONTENT:
The treatment for asthma involves a stepwise approach tailored to the severity of the disease and individual patient factors. The primary goals of asthma management are to control symptoms, reduce the risk of exacerbations, and minimize adverse effects of medications [1].

For **mild asthma**, the preferred treatment is an **inhaled glucocorticoid–formoterol combination as needed**. Alternative options include the use of combination inhaled glucocorticoid–albuterol as needed or low-dose maintenance inhaled glucocorticoid plus a short-acting β2-agonist (SABA) reliever as needed [1].

For **moderate-to-severe asthma**, the preferred treatment is **single maintenance and reliever therapy (SMART)** with a low- or medium-dose inhaled glucocorticoid–formoterol combination (either budesonide–formoterol or beclomethasone–formoterol). This regimen simplifies treatment by using one inhaler for both quick-relief and maintenance therapy. Alternative treatments include maintenance low- or medium-dose inhaled glucocorticoid–long-acting β2-agonist (LABA) plus as-needed SABA or as-needed combination inhaled glucocorticoid–SABA [1].

For **severe asthma** that remains uncontrolled despite high-dose inhaled glucocorticoid–LABA therapy, additional controller medications may be considered. These include **long-acting muscarinic antagonists (LAMAs)** such as tiotropium, **leukotriene receptor antagonists (LTRAs)** such as montelukast, and **biologic therapies** targeting specific inflammatory pathways [2].

**Biologic therapies** are recommended for patients with severe asthma and specific phenotypes:
- **Anti-IgE therapy (omalizumab)** for allergic asthma
- **Anti-IL-5/IL-5R therapy (mepolizumab, reslizumab, benralizumab)** for eosinophilic asthma
- **Anti-IL-4R therapy (dupilumab)** for type 2 inflammatory asthma [3]

In addition to pharmacologic therapy, **non-pharmacologic management** is essential and includes:
- Asthma education and self-management training
- Trigger avoidance (allergens, irritants, etc.)
- Regular physical activity
- Weight management for patients with obesity
- Smoking cessation [4]

CITATIONS:
1. Global Initiative for Asthma. Global Strategy for Asthma Management and Prevention, 2023 Update.
2. Holguin F, Cardet JC, Chung KF, et al. Management of Severe Asthma: a European Respiratory Society/American Thoracic Society Guideline. Eur Respir J. 2020;55(1):1900588.
3. Menzies-Gow A, Canonica GW, Winders TA, et al. A Charter to Improve Patient Care in Severe Asthma. Adv Ther. 2018;35(10):1485-1496.
4. Cloutier MM, Baptist AP, Blake KV, et al. 2020 Focused Updates to the Asthma Management Guidelines: A Report from the National Asthma Education and Prevention Program Coordinating Committee Expert Panel Working Group. J Allergy Clin Immunol. 2020;146(6):1217-1270.`;
  } else if (prompt.toLowerCase().includes('pneumonia')) {
    return `QUESTION:
What is the treatment for pneumonia?

SOURCE:
JAMA

CONTENT:
**Pneumonia** is an infection that inflames the air sacs in one or both lungs, which may fill with fluid or pus. The infection can be caused by various pathogens, including bacteria, viruses, and fungi [1]. The treatment approach depends on the type of pneumonia, the causative pathogen, the severity of symptoms, and patient factors such as age and comorbidities.

For **bacterial pneumonia**, which is the most common type requiring specific treatment, **antibiotics** are the mainstay of therapy [1]. The choice of antibiotic depends on several factors, including whether the pneumonia is community-acquired (CAP) or hospital-acquired (HAP), the suspected pathogen, and local resistance patterns [2].

For **mild to moderate community-acquired pneumonia** in otherwise healthy adults, oral antibiotics such as **amoxicillin, doxycycline, or a macrolide** (azithromycin or clarithromycin) are typically recommended as first-line treatments [2]. For patients with comorbidities or risk factors for drug-resistant pathogens, a **respiratory fluoroquinolone** (levofloxacin or moxifloxacin) or a **beta-lactam plus a macrolide** combination may be more appropriate [3].

For **severe pneumonia** requiring hospitalization, **intravenous antibiotics** are typically initiated. Common regimens include a **beta-lactam (such as ceftriaxone) plus a macrolide or a respiratory fluoroquinolone** [3]. For patients with risk factors for Pseudomonas aeruginosa, an **antipseudomonal beta-lactam** (piperacillin-tazobactam, cefepime, meropenem, or imipenem) plus either a fluoroquinolone or an aminoglycoside is recommended [2].

For **viral pneumonia**, such as that caused by influenza viruses, **antiviral medications** like oseltamivir (Tamiflu) may be prescribed if the illness is detected early [4]. For most other viral pneumonias, treatment is primarily supportive.

**Supportive care** is an essential component of pneumonia treatment and includes:
- Adequate hydration
- Oxygen therapy for hypoxemia
- Antipyretics for fever
- Pain management
- Respiratory therapy and pulmonary hygiene [1]

The duration of antibiotic therapy typically ranges from **5-7 days** for uncomplicated CAP to **14-21 days** for complicated pneumonia or certain pathogens like Pseudomonas aeruginosa or methicillin-resistant Staphylococcus aureus (MRSA) [3].

CITATIONS:
1. Pneumonia Diagnosis and Treatment. Mayo Clinic. 2021.
2. Metlay JP, Waterer GW, Long AC, et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. An Official Clinical Practice Guideline of the American Thoracic Society and Infectious Diseases Society of America. Am J Respir Crit Care Med. 2019;200(7):e45-e67.
3. National Institute for Health and Care Excellence (NICE). Pneumonia in adults: diagnosis and management. Clinical guideline [CG191]. 2019.
4. Kalil AC, Metersky ML, Klompas M, et al. Management of Adults With Hospital-acquired and Ventilator-associated Pneumonia: 2016 Clinical Practice Guidelines by the Infectious Diseases Society of America and the American Thoracic Society. Clin Infect Dis. 2016;63(5):e61-e111.`;
  } else {
    // Default response for other queries
    return `QUESTION:
${prompt}

SOURCE:
Mayo Clinic

CONTENT:
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

CITATIONS:
1. Medical Information on the Internet. National Library of Medicine. 2022.
2. Evaluating Health Information. MedlinePlus. 2021.`;
  }
};

const generateDeepSeekResponse = (prompt: string): string => {
  // Check for specific conditions in the prompt
  if (prompt.toLowerCase().includes('brucellosis')) {
    return `QUESTION:
What is the treatment for brucellosis?

SOURCE:
The Lancet

CONTENT:
**Brucellosis** is a bacterial zoonotic infection caused by various species of the genus Brucella. It's transmitted to humans through direct contact with infected animals, consumption of contaminated animal products (particularly unpasteurized dairy), or inhalation of aerosolized particles [1]. The disease can present with acute, subacute, or chronic manifestations, making proper treatment essential to prevent complications and relapse.

The treatment of brucellosis typically involves a **combination antibiotic approach** to effectively eradicate the intracellular bacteria. Single-agent therapy is associated with high relapse rates (up to 40%), which is why combination regimens are strongly recommended by international guidelines [2].

The **first-line treatment** for uncomplicated brucellosis in adults and children over 8 years of age consists of **doxycycline (100 mg twice daily) combined with rifampicin (600-900 mg once daily)** for a minimum duration of **6 weeks** [1,3]. This regimen has shown efficacy rates of 70-85% with relapse rates of approximately 5-10% [2].

For complicated brucellosis cases involving focal disease such as endocarditis, neurobrucellosis, or spondylitis, a **triple-drug regimen** is recommended. This typically includes **doxycycline, rifampicin, and an aminoglycoside (streptomycin or gentamicin)** for an extended period of 3-6 months, depending on clinical response [3,4].

**Alternative regimens** may be considered in specific populations:
- For **pregnant women and children under 8 years**, a combination of **trimethoprim-sulfamethoxazole and rifampicin** for 6 weeks is recommended due to the contraindication of doxycycline [2].
- For patients with **drug allergies or intolerance**, combinations including **fluoroquinolones (ciprofloxacin or levofloxacin)** with rifampicin may be used [3].

**Treatment monitoring** should include:
- Clinical assessment for symptom improvement
- Regular blood tests to monitor for drug side effects
- Serological testing to evaluate treatment response
- Extended follow-up for at least 12 months to detect potential relapse [4]

CITATIONS:
1. World Health Organization. Brucellosis in humans and animals. WHO guidance. Geneva: World Health Organization; 2020.
2. Ariza J, Bosilkovski M, Cascio A, et al. Perspectives for the treatment of brucellosis in the 21st century: the Ioannina recommendations. PLoS Medicine. 2019;16(12):e1003013.
3. Hasanjani Roushan MR, Ebrahimpour S. Human brucellosis: An overview. Caspian Journal of Internal Medicine. 2015;6(1):46-57.
4. Skalsky K, Yahav D, Bishara J, et al. Treatment of human brucellosis: systematic review and meta-analysis of randomised controlled trials. BMJ. 2008;336(7646):701-704.`;
  } else if (prompt.toLowerCase().includes('diabetes')) {
    return `QUESTION:
What is the treatment for diabetes?

SOURCE:
American Diabetes Association

CONTENT:
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

For patients with **established cardiovascular disease (CVD)** or at high risk for CVD, **SGLT2 inhibitors** or **GLP-1 RAs** with proven cardiovascular benefit are recommended independent of baseline HbA1c or individualized HbA1c target [4].

For patients with **diabetic kidney disease**, **SGLT2 inhibitors** are recommended to reduce progression of chronic kidney disease, cardiovascular events, and hospitalization for heart failure [4].

**Comprehensive diabetes care** also includes:
- Regular screening for complications (retinopathy, nephropathy, neuropathy)
- Cardiovascular risk reduction (blood pressure control, lipid management, antiplatelet therapy when indicated)
- Psychosocial care
- Immunizations
- Patient education and self-management support [1]

CITATIONS:
1. American Diabetes Association Professional Practice Committee. Standards of Medical Care in Diabetes—2023. Diabetes Care. 2023;46(Supplement 1):S1-S280.
2. DiMeglio LA, Evans-Molina C, Oram RA. Type 1 diabetes. Lancet. 2018;391(10138):2449-2462.
3. Brown SA, Kovatchev BP, Raghinaru D, et al. Six-Month Randomized, Multicenter Trial of Closed-Loop Control in Type 1 Diabetes. N Engl J Med. 2019;381(18):1707-1717.
4. Davies MJ, Aroda VR, Collins BS, et al. Management of Hyperglycemia in Type 2 Diabetes, 2022. A Consensus Report by the American Diabetes Association (ADA) and the European Association for the Study of Diabetes (EASD). Diabetes Care. 2022;45(11):2753-2786.`;
  } else {
    // Default response for other queries
    return `QUESTION:
${prompt}

SOURCE:
BMJ

CONTENT:
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

Medical knowledge evolves rapidly, and treatment recommendations can change based on new evidence. Therefore, it's important to consult current, authoritative sources for the most accurate information.

CITATIONS:
1. Smith J, et al. Evaluating the Quality of Online Health Information: A Systematic Review. Journal of Medical Internet Research. 2020;22(5):e17324.
2. Greenhalgh T. How to Read a Paper: The Basics of Evidence-Based Medicine. BMJ Books; 2019.`;
  }
};
