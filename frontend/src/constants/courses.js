export const durationOptions = [
  '6 months',
  '12 months / 1 year',
  '1.5 year',
  '2 year',
  '3 year',
]

export const requirementOptions = ['10th pass', '10+2', 'Graduate', 'Post graduate']

export const defaultCourseTypes = ['Computer', 'University', 'Management', 'Vocational']

export const seedCourses = [
  {
    id: 'c1',
    name: 'Diploma in Computer Applications',
    description:
      'A practical diploma covering office tools, programming basics, and the first steps of building for the web.',
    duration: '12 months / 1 year',
    subjects: ['Computer fundamentals', 'Office tools', 'Programming basics', 'Web basics'],
    requirement: '10+2',
    fee: 45000,
    offerPrice: 39900,
    type: 'Computer',
    isActive: true,
  },
  {
    id: 'c2',
    name: 'Bachelor of Computer Applications',
    description:
      'A three-year university programme in software, databases, and applied computing for students after 10+2.',
    duration: '3 year',
    subjects: ['Programming', 'Database systems', 'Operating systems', 'Mathematics', 'Project'],
    requirement: '10+2',
    fee: 180000,
    offerPrice: 165000,
    type: 'University',
    isActive: true,
  },
  {
    id: 'c3',
    name: 'Web Design Certificate',
    description: 'A short certificate for layout, visual design, and publishing a simple website.',
    duration: '6 months',
    subjects: ['HTML', 'CSS', 'Design basics'],
    requirement: '10th pass',
    fee: 18000,
    offerPrice: 14999,
    type: 'Computer',
    isActive: true,
  },
  {
    id: 'c4',
    name: 'Master of Business Administration',
    description: 'A postgraduate management programme with finance, marketing, and organisational study.',
    duration: '2 year',
    subjects: ['Finance', 'Marketing', 'Organisational behaviour', 'Strategy'],
    requirement: 'Graduate',
    fee: 240000,
    offerPrice: 220000,
    type: 'University',
    isActive: true,
  },
  {
    id: 'c5',
    name: 'Advanced Data Analytics',
    description: 'A longer analytics course for graduates who want statistics, spreadsheets, and reporting practice.',
    duration: '1.5 year',
    subjects: ['Statistics', 'Spreadsheets', 'Data visualisation', 'Reporting'],
    requirement: 'Graduate',
    fee: 95000,
    offerPrice: 82000,
    type: 'Vocational',
    isActive: false,
  },
]
