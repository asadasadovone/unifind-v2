export const UNI_DATA = [
  {
    id: 1, name: "Technical University of Munich", short: "TUM",
    country: "Germany", city: "Munich", flag: "🇩🇪",
    tuition: 0, degree: "Master", attendance: "On-campus", format: "Full-time",
    language: "English", duration: "2 years", startDate: "Oct 2026",
    match: 98, scholarship: true, field: "Computer Science",
    blurb: "World-class engineering and natural sciences. Tuition-free for EU and international students alike."
  },
  {
    id: 2, name: "Delft University of Technology", short: "TU Delft",
    country: "Netherlands", city: "Delft", flag: "🇳🇱",
    tuition: 4200, degree: "Master", attendance: "On-campus", format: "Full-time",
    language: "English", duration: "2 years", startDate: "Sep 2026",
    match: 96, scholarship: true, field: "Computer Science",
    blurb: "Top-ranked European university for engineering. Strong industry partnerships and research labs."
  },
  {
    id: 3, name: "ETH Zürich", short: "ETH",
    country: "Switzerland", city: "Zürich", flag: "🇨🇭",
    tuition: 2800, degree: "Master", attendance: "On-campus", format: "Full-time",
    language: "English", duration: "1.5 years", startDate: "Sep 2026",
    match: 94, scholarship: true, field: "Computer Science",
    blurb: "Consistently ranked among the world's top universities. Highly selective, exceptional research output."
  },
  {
    id: 4, name: "KTH Royal Institute of Technology", short: "KTH",
    country: "Sweden", city: "Stockholm", flag: "🇸🇪",
    tuition: 0, degree: "Master", attendance: "On-campus", format: "Full-time",
    language: "English", duration: "2 years", startDate: "Aug 2026",
    match: 92, scholarship: true, field: "Computer Science",
    blurb: "Sweden's largest technical university. Free tuition for EU/EEA students."
  },
  {
    id: 5, name: "University of Amsterdam", short: "UvA",
    country: "Netherlands", city: "Amsterdam", flag: "🇳🇱",
    tuition: 3900, degree: "Bachelor", attendance: "On-campus", format: "Full-time",
    language: "English", duration: "3 years", startDate: "Sep 2026",
    match: 91, scholarship: false, field: "Data Science",
    blurb: "Comprehensive research university in the heart of Amsterdam, known for interdisciplinary programs."
  },
  {
    id: 6, name: "Aalto University", short: "Aalto",
    country: "Finland", city: "Espoo", flag: "🇫🇮",
    tuition: 1800, degree: "Master", attendance: "Blended", format: "Full-time",
    language: "English", duration: "2 years", startDate: "Sep 2026",
    match: 89, scholarship: true, field: "Design & Tech",
    blurb: "Where business, art, and technology meet. Renowned for design-led innovation."
  },
  {
    id: 7, name: "University of Bologna", short: "UniBO",
    country: "Italy", city: "Bologna", flag: "🇮🇹",
    tuition: 2200, degree: "Master", attendance: "On-campus", format: "Full-time",
    language: "Italian", duration: "2 years", startDate: "Oct 2026",
    match: 87, scholarship: true, field: "Liberal Arts",
    blurb: "The oldest university in continuous operation. Rich academic tradition with modern research strengths."
  },
  {
    id: 8, name: "Vienna University of Technology", short: "TU Wien",
    country: "Austria", city: "Vienna", flag: "🇦🇹",
    tuition: 1450, degree: "Master", attendance: "On-campus", format: "Full-time",
    language: "English", duration: "2 years", startDate: "Oct 2026",
    match: 85, scholarship: false, field: "Computer Science",
    blurb: "Vienna's leading technical university with a focus on computer science and informatics."
  },
  {
    id: 9, name: "Trinity College Dublin", short: "Trinity",
    country: "Ireland", city: "Dublin", flag: "🇮🇪",
    tuition: 5800, degree: "Master", attendance: "On-campus", format: "Full-time",
    language: "English", duration: "1 year", startDate: "Sep 2026",
    match: 84, scholarship: true, field: "Business",
    blurb: "Ireland's oldest university. Beautiful historic campus combined with modern research facilities."
  },
  {
    id: 10, name: "Sorbonne Université", short: "Sorbonne",
    country: "France", city: "Paris", flag: "🇫🇷",
    tuition: 850, degree: "Master", attendance: "On-campus", format: "Full-time",
    language: "French", duration: "2 years", startDate: "Sep 2026",
    match: 82, scholarship: true, field: "Computer Science",
    blurb: "Storied Parisian university with strengths across sciences, humanities, and medicine."
  }
];

export const COUNTRIES = [
  "Any country", "European Union", "Germany", "Netherlands", "Switzerland",
  "Sweden", "Finland", "Italy", "Austria", "Ireland", "France", "Spain",
  "Denmark", "Norway", "United Kingdom", "United States", "Canada", "Australia"
];

export const SAMPLE_CHAT = {
  "Apply dates": [
    { role: "user", text: "When can I apply to this university?" },
    { role: "ai", text: "Applications for the 2026 intake open on **November 1, 2025** and close on **March 15, 2026**. Late applications are not accepted for the M.Sc. Computer Science program.\n\nKey dates:\n• Application opens: Nov 1, 2025\n• Priority deadline: Jan 15, 2026 (early scholarship review)\n• Final deadline: Mar 15, 2026\n• Decision letters: Apr–May 2026\n• Enrollment confirmation: Jun 30, 2026" }
  ],
  "City info": [
    { role: "user", text: "Tell me about life in this city." },
    { role: "ai", text: "A vibrant, student-friendly city with strong public transport and a sizable international community.\n\n**Cost of living** (monthly, student): ~1,400 AZN incl. shared housing.\n**Climate**: Mild summers (18–24°C), cold winters with occasional snow.\n**Getting around**: Excellent metro and tram network — most students bike year-round.\n**Student life**: Dozens of student associations, weekly events, and a thriving café/co-working scene." }
  ],
  "Requirements": [
    { role: "user", text: "What are the admission requirements?" },
    { role: "ai", text: "**Academic**\n• Bachelor's degree in Computer Science or a closely related field\n• GPA equivalent to 3.0/4.0 (B average) minimum\n\n**Language**\n• English: TOEFL 88+ / IELTS 6.5+ / Duolingo 115+\n\n**Documents**\n• Transcript of records\n• Statement of purpose (1–2 pages)\n• 2 letters of recommendation\n• CV / Résumé\n• Proof of language proficiency\n\n**Optional but recommended**\n• Portfolio or research samples\n• GRE (not required, but strengthens application)" }
  ],
  "Scholarships": [
    { role: "user", text: "What scholarships are available?" },
    { role: "ai", text: "Several funding options are available for international students:\n\n**Merit-based**\n• Excellence Scholarship — full tuition + 800 AZN/month stipend (top 5% of applicants)\n• Dean's Award — 50% tuition discount\n\n**Need-based**\n• Diversity Grant — up to 6,000 AZN/year\n• Emerging Markets Fellowship — full tuition for selected countries\n\n**External**\n• Erasmus+ Mundus Joint Master programs\n• DAAD scholarships (for Germany)\n• Government scholarships from your home country\n\nApply for scholarships **at the same time** as your admission application — most close on January 15." }
  ]
};
