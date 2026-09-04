// Field-of-study catalogue for the search autocomplete.
// Grouped the way students actually think about disciplines: a broad area
// they recognise, with the specific programmes underneath it.

export const FIELD_GROUPS = [
  {
    label: 'Agriculture & Forestry',
    icon: 'leaf',
    children: ['Agricultural Science', 'Agribusiness', 'Animal Science', 'Food Science & Technology', 'Forestry', 'Horticulture', 'Soil Science', 'Veterinary Medicine'],
  },
  {
    label: 'Applied Sciences & Professions',
    icon: 'flask',
    children: ['Aviation', 'Biotechnology', 'Criminology', 'Fashion & Textiles', 'Library & Information Science', 'Logistics', 'Nutrition & Dietetics', 'Security Studies'],
  },
  {
    label: 'Arts, Design & Architecture',
    icon: 'palette',
    children: ['Architecture', 'Fine Arts', 'Graphic Design', 'Industrial Design', 'Interior Design', 'Music', 'Performing Arts', 'Photography', 'Urban Planning'],
  },
  {
    label: 'Business & Management',
    icon: 'briefcase',
    children: ['Accounting', 'Business Administration (MBA)', 'Entrepreneurship', 'Finance', 'Human Resources', 'International Business', 'Management', 'Marketing', 'Supply Chain Management'],
  },
  {
    label: 'Computer Science & IT',
    icon: 'code',
    children: ['Artificial Intelligence', 'Computer Science', 'Cybersecurity', 'Data Science', 'Game Development', 'Human-Computer Interaction', 'Information Systems', 'Machine Learning', 'Software Engineering'],
  },
  {
    label: 'Education & Training',
    icon: 'cap',
    children: ['Curriculum & Instruction', 'Early Childhood Education', 'Educational Leadership', 'Educational Technology', 'Higher Education', 'Special Education', 'TESOL'],
  },
  {
    label: 'Engineering & Technology',
    icon: 'gear',
    children: ['Aerospace Engineering', 'Automotive Engineering', 'Biomedical Engineering', 'Chemical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Industrial Engineering', 'Materials Science', 'Mechanical Engineering', 'Robotics'],
  },
  {
    label: 'Environment & Earth Sciences',
    icon: 'globe',
    children: ['Climate Science', 'Ecology', 'Energy Systems', 'Environmental Engineering', 'Environmental Science', 'Geology', 'Marine Science', 'Sustainability', 'Water Management'],
  },
  {
    label: 'Hospitality, Leisure & Sports',
    icon: 'trophy',
    children: ['Event Management', 'Hospitality Management', 'Sport Management', 'Sports Science', 'Tourism Management'],
  },
  {
    label: 'Humanities',
    icon: 'book',
    children: ['Anthropology', 'Archaeology', 'Art History', 'Cultural Studies', 'History', 'Linguistics', 'Literature', 'Philosophy', 'Religious Studies', 'Translation Studies'],
  },
  {
    label: 'Journalism & Media',
    icon: 'mic',
    children: ['Communication Studies', 'Digital Media', 'Film & Television', 'Journalism', 'Media Studies', 'Public Relations'],
  },
  {
    label: 'Law',
    icon: 'scale',
    children: ['Commercial Law', 'Criminal Law', 'Human Rights Law', 'Intellectual Property Law', 'International Law', 'Tax Law'],
  },
  {
    label: 'Medicine & Health',
    icon: 'heart',
    children: ['Biomedical Science', 'Dentistry', 'Epidemiology', 'Medicine', 'Nursing', 'Pharmacy', 'Physiotherapy', 'Psychology (Clinical)', 'Public Health'],
  },
  {
    label: 'Natural Sciences & Mathematics',
    icon: 'atom',
    children: ['Astronomy', 'Biology', 'Biochemistry', 'Chemistry', 'Genetics', 'Mathematics', 'Neuroscience', 'Physics', 'Statistics'],
  },
  {
    label: 'Social Sciences',
    icon: 'users',
    children: ['Development Studies', 'Economics', 'International Relations', 'Political Science', 'Psychology', 'Public Administration', 'Social Work', 'Sociology'],
  },
]

// Flat list of every selectable value, used for substring matching.
export const ALL_FIELDS = FIELD_GROUPS.flatMap(g => [g.label, ...g.children])
