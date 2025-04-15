/**
 * Personality utilities for the medical platform
 * Contains functions to generate medical jokes, facts, quotes, and healthcare tips
 */

/**
 * Get a random item from an array
 */
const getRandomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

/**
 * Get a consistent greeting based on time of day
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

/**
 * Get a personalized greeting based on time of day and user name
 */
export const getPersonalizedGreeting = (name?: string): string => {
  const greeting = getGreeting();
  
  if (!name) {
    return `${greeting}, Doctor`;
  }
  
  // Add more greeting variations
  const variations = [
    `${greeting}, Dr. ${name}. How can I assist you today?`,
    `Ready when you are, Dr. ${name}. ${greeting}.`,
    `${greeting}! What medical insights can I help you uncover, Dr. ${name}?`,
    `Welcome back, Dr. ${name}. ${greeting}. Let's get started.`
  ];
  
  // Return a consistent greeting for a session, but vary across sessions (simple approach)
  // A more robust approach might involve session IDs or timestamps
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return variations[dayOfYear % variations.length]; 
};

/**
 * Get specialty-based suggestions for the chat
 */
export const getSpecialtyBasedSuggestions = (specialty?: string): string[] => {
  // Default suggestions (general medicine)
  const defaultSuggestions = [
    "What's the latest research on COVID-19 treatments?",
    "Help me interpret these lab results",
    "What are the side effects of metformin?",
    "Differential diagnosis for chest pain and shortness of breath",
    "Summarize the new guidelines for hypertension management",
    "What's the recommended antibiotic for community-acquired pneumonia?"
  ];
  
  // Specialty-specific suggestions
  const specialtySuggestions: Record<string, string[]> = {
    cardiology: [
      "What's the latest research on SGLT2 inhibitors for heart failure?",
      "Help me interpret this complex ECG",
      "What are the side effects of the new anticoagulants?",
      "Differential diagnosis for chest pain with normal troponin",
      "Summarize the new guidelines for atrial fibrillation management",
      "What's the recommended approach for resistant hypertension?"
    ],
    neurology: [
      "What's the latest research on Alzheimer's treatments?",
      "Help me interpret these MRI findings",
      "What are the side effects of the new MS medications?",
      "Differential diagnosis for recurrent headaches with visual aura",
      "Summarize the new guidelines for stroke management",
      "What's the recommended approach for refractory epilepsy?"
    ],
    oncology: [
      "What's the latest research on immunotherapy for lung cancer?",
      "Help me interpret these tumor marker results",
      "What are the side effects of the new targeted therapies?",
      "Differential diagnosis for unexplained weight loss and fatigue",
      "Summarize the new guidelines for breast cancer screening",
      "What's the recommended approach for managing chemotherapy-induced nausea?"
    ],
    pediatrics: [
      "What's the latest research on RSV prevention?",
      "Help me interpret these growth charts",
      "What are the side effects of the new ADHD medications?",
      "Differential diagnosis for recurrent abdominal pain in children",
      "Summarize the new guidelines for childhood vaccination",
      "What's the recommended approach for managing pediatric asthma?"
    ]
  };
  
  // Return specialty-specific suggestions if available, otherwise default
  if (specialty && specialtySuggestions[specialty.toLowerCase()]) {
    return specialtySuggestions[specialty.toLowerCase()];
  }
  
  return defaultSuggestions;
};

/**
 * Get a random loading message
 */
export const getLoadingMessage = (): string => {
  return getRandomItem([
    "Consulting medical literature...",
    "Analyzing patient data...",
    "Reviewing clinical guidelines...",
    "Checking latest research...",
    "Processing medical information...",
    "Examining diagnostic criteria...",
    "Synthesizing medical knowledge...",
    "Preparing clinical insights...",
    "Gathering evidence-based recommendations...",
    "Compiling medical expertise...",
    "Reviewing differential diagnoses...",
    "Checking treatment protocols...",
    "Analyzing clinical pathways...",
    "Consulting specialist knowledge...",
    "Preparing your results...",
    "Checking the latest publications...",
    "Cross-referencing clinical databases...",
    "Engaging neural networks...",
    "Warming up the algorithms...",
    "Just a moment, accessing relevant protocols...",
    "Synthesizing data streams...",
    "Let me think...", // Simple and direct
    "Processing... like a well-oiled EMR.", // Subtle humor
    "Fetching insights from the digital ether..."
  ]);
};

/**
 * Get a random medical joke
 */
export const getMedicalJoke = (): string => {
  return getRandomItem([
    "Why don't scientists trust atoms? Because they make up everything!",
    "I told my doctor that I broke my arm in two places. He told me to stop going to those places.",
    "Did you hear about the doctor who was always in a bad mood? He had a lot of patients.",
    "What did the cardiologist say when his patient wanted to eat at a fast food restaurant? I'm afraid that's not in your heart's best interest.",
    "Why did the radiologist go to the bank? To check his cache.",
    "What's the difference between a neurologist and a psychiatrist? A neurologist knows nothing about the mind and a psychiatrist knows nothing about the brain.",
    "Why did the nurse need a red pen at work? In case she needed to draw blood.",
    "What did the endocrinologist say to their patient? I'm sorry, but I don't have the thyroid eye'd like to give you.",
    "Why did the ophthalmologist become a teacher? They had a lot of pupils.",
    "What do you call a doctor who fixes websites? A URL-ologist.",
    "Why don't antibiotics tell jokes? They're too busy fighting bacterial.",
    "What's a neurologist's favorite dessert? Nerve pudding.",
    "Why did the doctor become a gardener? They wanted to help people put down roots.",
    "What did one tonsil say to the other tonsil? Get dressed up, the doctor is taking us out tonight!",
    "Why did the cookie go to the hospital? Because it felt crummy.",
    "What did the patient say after the doctor removed his left ventricle? I can't believe you had the heart to do that.",
    "Why did the doctor take a red pen to work? In case they needed to draw blood.",
    "What's a cardiologist's favorite type of music? Heart beat.",
    "Why did the doctor carry a red pen? In case they needed to draw blood.",
    "What did the cardiologist's valentine card say? I'm not being pulmonary, but you make my heart flutter."
  ]);
};

/**
 * Get a random medical fact
 */
export const getMedicalFact = (): string => {
  return getRandomItem([
    "The human body contains enough iron to make a nail 3 inches long.",
    "Your brain uses 20% of the total oxygen in your body.",
    "The average human heart beats 100,000 times per day.",
    "Your nose can remember 50,000 different scents.",
    "The human body has over 600 muscles.",
    "The acid in your stomach is strong enough to dissolve zinc.",
    "The human eye can distinguish between approximately 10 million different colors.",
    "The average person produces enough saliva in their lifetime to fill two swimming pools.",
    "Your body has enough DNA to stretch from the sun to Pluto and back 17 times.",
    "The human brain can generate about 23 watts of power when awake.",
    "The cornea is the only part of the body with no blood supply; it gets oxygen directly from the air.",
    "The average person takes about 23,000 breaths per day.",
    "The human skeleton renews itself completely every 10 years.",
    "The human body contains enough fat to make 7 bars of soap.",
    "The average person has 67 different species of bacteria in their belly button.",
    "The human brain can read up to 1,000 words per minute.",
    "The average person's skin weighs twice as much as their brain.",
    "The human body contains enough carbon to make 900 pencils.",
    "The average person blinks about 15-20 times per minute.",
    "The human body produces enough heat in 30 minutes to boil a half-gallon of water."
  ]);
};

/**
 * Get a random medical quote
 */
export const getMedicalQuote = (): string => {
  return getRandomItem([
    "The good physician treats the disease; the great physician treats the patient who has the disease. — William Osler",
    "Let food be thy medicine and medicine be thy food. — Hippocrates",
    "The art of medicine consists of amusing the patient while nature cures the disease. — Voltaire",
    "The greatest medicine of all is to teach people how not to need it. — Hippocrates",
    "Wherever the art of medicine is loved, there is also a love of humanity. — Hippocrates",
    "The doctor of the future will give no medicine, but will interest his patients in the care of the human frame, in diet, and in the cause and prevention of disease. — Thomas Edison",
    "The best doctors in the world are Doctor Diet, Doctor Quiet, and Doctor Merryman. — Jonathan Swift",
    "Medicine is not only a science; it is also an art. It does not consist of compounding pills and plasters; it deals with the very processes of life, which must be understood before they may be guided. — Paracelsus",
    "The practice of medicine is an art, not a trade; a calling, not a business; a calling in which your heart will be exercised equally with your head. — William Osler",
    "The aim of medicine is to prevent disease and prolong life; the ideal of medicine is to eliminate the need of a physician. — William J. Mayo",
    "Medicine is a science of uncertainty and an art of probability. — William Osler",
    "The physician should not treat the disease but the patient who is suffering from it. — Maimonides",
    "The first duties of the physician is to educate the masses not to take medicine. — William Osler",
    "The best of healers is good cheer. — Pindar",
    "To array a man's will against his sickness is the supreme art of medicine. — Henry Ward Beecher",
    "The art of healing comes from nature, not from the physician. Therefore the physician must start from nature, with an open mind. — Paracelsus",
    "The physician's highest calling, his only calling, is to make sick people healthy — to heal, as it is termed. — Samuel Hahnemann",
    "The art of medicine was to be properly learned only from its practice and its exercise. — Thomas Sydenham",
    "The patient is the center of the medical universe around which all our work revolves and towards which all our efforts tend. — John Shaw Billings",
    "The very first requirement in a hospital is that it should do the sick no harm. — Florence Nightingale"
  ]);
};

/**
 * Get a random healthcare tip
 */
export const getHealthcareTip = (): string => {
  return getRandomItem([
    "When documenting patient encounters, use specific, measurable terms rather than vague descriptions.",
    "Schedule your most challenging cases earlier in the day when your mental energy is at its peak.",
    "Take a moment to review lab results before entering the exam room to avoid missing critical information.",
    "Use the teach-back method to confirm patient understanding of treatment plans.",
    "Block 15-30 minutes each day for reviewing test results and following up with patients.",
    "Keep a digital or physical journal of interesting cases for future reference and learning.",
    "Practice empathetic listening by making eye contact and avoiding interruptions during patient conversations.",
    "Develop a consistent system for tracking referrals to ensure proper follow-up.",
    "Consider using medical scribes or voice recognition software to reduce documentation time.",
    "Schedule brief breaks between patients to reset mentally and avoid decision fatigue.",
    "Create templated patient education materials for common conditions to save time.",
    "Establish a routine for staying current with medical literature in your specialty.",
    "Use the SOAP format (Subjective, Objective, Assessment, Plan) for clear, organized documentation.",
    "Develop a personal system for flagging high-risk patients who need extra attention.",
    "Practice explaining complex medical concepts using simple analogies that patients can understand.",
    "Consider implementing a pre-visit planning process to identify needed tests or screenings.",
    "Use motivational interviewing techniques when discussing lifestyle changes with patients.",
    "Develop a consistent handoff protocol to ensure continuity of care during shift changes.",
    "Schedule administrative tasks during your natural energy lulls to maximize clinical effectiveness.",
    "Create a personal library of trusted resources for quick reference during patient care."
  ]);
};

/**
 * Get a random success message
 */
export const getSuccessMessage = (): string => {
  return getRandomItem([
    "Great work! Your medical expertise is making a difference.",
    "Success! Your clinical judgment is spot on.",
    "Well done! Your attention to detail is impressive.",
    "Excellent! Your diagnostic skills are remarkable.",
    "Perfect! Your medical knowledge is exceptional.",
    "Fantastic! Your clinical reasoning is outstanding.",
    "Bravo! Your medical acumen is impressive.",
    "Superb! Your clinical expertise is evident.",
    "Wonderful! Your medical insight is valuable.",
    "Impressive! Your clinical skills are exceptional.",
    "Nicely done, Doctor!",
    "Task completed successfully.",
    "Consider it done.",
    "Affirmative. Operation successful.", // Slightly robotic wit
    "Executed flawlessly.",
    "That's the power of collaboration (human + AI)!"
  ]);
};

/**
 * Get a random error message
 */
export const getErrorMessage = (): string => {
  return getRandomItem([
    "Hmm, that didn't work as expected. Let's try a different approach.",
    "It seems we've encountered a complication. Let's reassess.",
    "That didn't quite work. Let's consider an alternative method.",
    "We've hit a roadblock. Let's explore other options.",
    "That approach didn't yield the expected results. Let's reconsider.",
    "We need to adjust our approach. Let's try something else.",
    "That didn't go as planned. Let's try a different technique.",
    "We've encountered an unexpected result. Let's reevaluate.",
    "That wasn't successful. Let's consider a different strategy.",
    "We need to pivot. Let's try another approach.",
    "Apologies, encountered a slight anomaly. Could you try again?", // AI-themed
    "My diagnostic algorithm seems to be disagreeing with reality. Let's re-run that.", // Self-deprecating wit
    "Error: Unexpected variable encountered. Please try rephrasing.",
    "Request timed out. Perhaps the server needed a coffee break?", // Gentle humor
    "Could not compute. Please check input or try a different query."
  ]);
};
