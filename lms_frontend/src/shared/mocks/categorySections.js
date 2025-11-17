export const categorySections = {
  'data-science': [
    {
      title: 'Python for Data',
      rating: 5,
      progress: 45,
      lessons: [
        { title: 'Numpy Arrays Primer', duration: '11m', type: 'video' },
        { title: 'Pandas Series & DataFrames', duration: '15m', type: 'video' },
        { title: 'Data Cleaning Patterns', duration: '1h', type: 'video' },
      ],
    },
    {
      title: 'Visualization',
      rating: 5,
      progress: 30,
      lessons: [
        { title: 'Matplotlib Basics', duration: '10m', type: 'video' },
        { title: 'Seaborn for EDA', duration: '12m', type: 'video' },
        { title: 'Plot Styling', duration: '9m', type: 'video' },
      ],
    },
    {
      title: 'Intro to ML',
      rating: 5,
      progress: 60,
      lessons: [
        { title: 'Supervised vs Unsupervised', duration: '12m', type: 'video' },
        { title: 'KNN Basics', duration: '14m', type: 'video' },
        { title: 'Regression vs. Classification', duration: '15m', type: 'video' },
      ],
    },
  ],
  'cloud': [
    {
      title: 'AWS Core Services',
      progress: 40,
      lessons: [
        { title: 'IAM Basics', duration: '10m', type: 'video' },
        { title: 'Compute with EC2', duration: '1h', type: 'video' },
        { title: 'Storage with S3', duration: '1h', type: 'video' },
      ],
    },
    {
      title: 'Azure Fundamentals',
      progress: 25,
      lessons: [
        { title: 'Resource Groups & RBAC', duration: '12m', type: 'video' },
        { title: 'Compute with VM Scale Sets', duration: '1h', type: 'video' },
        { title: 'Networking Basics', duration: '15m', type: 'video' },
      ],
    },
    {
      title: 'GCP Essentials',
      progress: 35,
      lessons: [
        { title: 'Projects, Billing', duration: '10m', type: 'video' },
        { title: 'Compute Engine', duration: '1h', type: 'video' },
        { title: 'Storage', duration: '1h', type: 'video' },
      ],
    },
  ],
  'software-testing': [
    {
      title: 'Testing Basics',
      progress: 20,
      lessons: [
        { title: 'What is Software Testing?', type: 'video', duration: '8m' },
        { title: 'V&V vs V&L (PDF)', type: 'pdf', href: 'https://example.com/vnv.pdf' },
      ],
    },
    {
      title: 'Test Case Design Principles',
      progress: 45,
      lessons: [
        { title: 'ISTQB Foundation Syllabus (PDF)', type: 'pdf', href: 'https://example.com/istqb.pdf' },
        { title: 'Tutorial – Test Case Management', type: 'link', href: 'https://example.com/test-cases' },
      ],
    },
    {
      title: 'Test Planning & Execution',
      progress: 55,
      lessons: [
        { title: 'Writing Effective Test Plans', type: 'video', duration: '12m' },
        { title: 'Bug Reporting Template (PDF)', type: 'pdf', href: 'https://example.com/bug-template.pdf' },
      ],
    },
  ],
  'ai': [
    {
      title: 'Foundations',
      progress: 30,
      lessons: [
        { title: 'Linear Algebra for ML', type: 'pdf', href: 'https://example.com/linalg.pdf' },
        { title: 'Probability Refresher', type: 'pdf', href: 'https://example.com/prob.pdf' },
        { title: 'Supervised vs Unsupervised', type: 'video', duration: '10m' },
      ],
    },
    {
      title: 'Deep Learning',
      progress: 50,
      lessons: [
        { title: 'Neural Networks', type: 'video', duration: '15m' },
        { title: 'Activation Functions Explained', type: 'video', duration: '11m' },
      ],
    },
  ],
};
