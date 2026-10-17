export const SITE_URL = 'https://minnthanthmue.com';

export type SectionId = 'top' | 'about' | 'education' | 'stack' | 'projects' | 'experience' | 'contact';

export interface SectionConfig {
  id: SectionId;
  label: string;
  indexLabel?: string;
  shortcut: number;
  icon: 'House' | 'User' | 'GraduationCap' | 'Layers' | 'FolderKanban' | 'Briefcase' | 'Mail';
}

/**
 * 1. NEW PAGE ORDER
 * Order lives in this array, so sections can be reordered by editing this array only.
 * 1. Home
 * 2. About
 * 3. Education
 * 4. Stack
 * 5. Projects
 * 6. Experience
 * 7. Contact
 */
export const SECTIONS_ORDER: SectionConfig[] = [
  { id: 'top', label: 'Home', shortcut: 1, icon: 'House' },
  { id: 'about', label: 'About', indexLabel: '01  About', shortcut: 2, icon: 'User' },
  { id: 'education', label: 'Education', indexLabel: '02  Education', shortcut: 3, icon: 'GraduationCap' },
  { id: 'stack', label: 'Stack', indexLabel: '03  Stack', shortcut: 4, icon: 'Layers' },
  { id: 'projects', label: 'Projects', indexLabel: '04  Projects', shortcut: 5, icon: 'FolderKanban' },
  { id: 'experience', label: 'Experience', indexLabel: '05  Experience', shortcut: 6, icon: 'Briefcase' },
  { id: 'contact', label: 'Contact', indexLabel: '06  Contact', shortcut: 7, icon: 'Mail' },
];

export interface TimelineMilestone {
  year: string;
  title: string;
  subtitle?: string;
  status: 'completed' | 'current' | 'upcoming';
  label: string;
  statusLabel?: string;
  isUniversity?: boolean;
}

export interface CertificateEntry {
  id: string;
  title: string;
  issuer: string;
  issuerLogo: string;
  image: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  description: string;
  tags: string[];
  // Backwards compatibility fields
  kind?: string;
  platform?: string;
  date?: string;
  courses?: number;
  url?: string;
  logo?: string;
}

export interface ToolItem {
  name: string;
  logoSrc?: string;
  altText: string;
}

export interface ToolCategory {
  category: string;
  tools: ToolItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  url?: string;
}

export interface EducationTabItem {
  title: string;
  files: string[];
}

export interface SiteContent {
  meta: {
    title: string;
    description: string;
    canonicalUrl: string;
  };
  hero: {
    name: string;
    introPrefix: string;
    introUniversity: string;
    description: string;
    ctaText: string;
    resumeText?: string;
    resumeUrl?: string;
    avatarSrc: string;
    avatarAlt: string;
  };
  about: {
    heading: string;
    paragraph1: string;
    paragraph2: string;
  };
  stack: {
    heading: string;
    categories: ToolCategory[];
  };
  projects: {
    heading: string;
    items: ProjectItem[];
    placeholder: {
      badge: string;
      text: string;
    };
  };
  experience: {
    heading: string;
    statement: string;
    ctaText: string;
  };
  education: {
    heading: string;
    specializations?: string[];
    timeline: TimelineMilestone[];
    timelineTabs: EducationTabItem[];
    certificates: CertificateEntry[];
  };
  contact: {
    heading: string;
    items: {
      type: 'email' | 'github' | 'linkedin';
      label: string;
      value: string;
      href: string;
    }[];
    primaryCtaText: string;
  };
  footer: {
    text: string;
    authorName: string;
  };
}

export const siteContent: SiteContent = {
  meta: {
    title: 'Minn Thant Hmue | Digital Business and Innovation Student',
    description:
      'I build fast, reliable web interfaces, machine learning models, and automated AI pipelines. I am looking for an opportunity to show what I can do.',
    canonicalUrl: SITE_URL,
  },
  hero: {
    name: 'Minn Thant Hmue',
    introPrefix: 'Digital Business and Innovation Student at ',
    introUniversity: 'Tokyo International University.',
    description:
      'I build fast, reliable web interfaces, machine learning models, and automated AI pipelines. I am looking for an opportunity to show what I can do.',
    ctaText: 'Contact',
    avatarSrc: '/images/profile.png',
    avatarAlt: 'Hand-drawn avatar of Minn',
  },
  about: {
    heading: 'About',
    paragraph1:
      'I am Minn Thant Hmue, a Digital Business & Innovation student at Tokyo International University. I am originally from Myanmar and currently live in Tokyo. I am interested in connecting technical development with product thinking, and I enjoy learning how to build fast, reliable web interfaces, machine learning models, and automated AI workflows.',
    paragraph2:
      'I like software that is simple and does its job well. Instead of treating AI as a buzzword, I experiment with practical workflows using local language models through Ollama, n8n automations, and AI model APIs. Through these projects, I am learning how to turn repetitive manual tasks into small automated processes that run in the background.',
  },
  stack: {
    heading: 'Stack',
    categories: [
      {
        category: 'frontend',
        tools: [
          { name: 'React', logoSrc: '/assets/logos/react.svg', altText: 'React logo' },
          { name: 'TypeScript', logoSrc: '/assets/logos/typescript.svg', altText: 'TypeScript logo' },
          { name: 'JavaScript', logoSrc: '/assets/logos/javascript.svg', altText: 'JavaScript logo' },
          { name: 'HTML5', logoSrc: '/assets/logos/html5.svg', altText: 'HTML5 logo' },
          { name: 'CSS3', logoSrc: '/assets/logos/css3.svg', altText: 'CSS3 logo' },
        ],
      },
      {
        category: 'automation & AI',
        tools: [
          { name: 'n8n', logoSrc: '/assets/logos/n8n.svg', altText: 'n8n logo' },
          { name: 'Ollama', logoSrc: '/assets/logos/ollama.svg', altText: 'Ollama logo' },
          { name: 'Claude (Anthropic)', logoSrc: '/assets/logos/claude.svg', altText: 'Claude (Anthropic) logo' },
          { name: 'OpenAI', logoSrc: '/assets/logos/openai.svg', altText: 'OpenAI logo' },
          { name: 'Hugging Face', logoSrc: '/assets/logos/huggingface.svg', altText: 'Hugging Face logo' },
          { name: 'LangChain', logoSrc: '/assets/logos/langchain.svg', altText: 'LangChain logo' },
        ],
      },
      {
        category: 'machine learning',
        tools: [
          { name: 'Python', logoSrc: '/assets/logos/python.svg', altText: 'Python logo' },
          { name: 'PyTorch', logoSrc: '/assets/logos/pytorch.svg', altText: 'PyTorch logo' },
          { name: 'TensorFlow', logoSrc: '/assets/logos/tensorflow.svg', altText: 'TensorFlow logo' },
          { name: 'Keras', logoSrc: '/assets/logos/keras.svg', altText: 'Keras logo' },
          { name: 'scikit-learn', logoSrc: '/assets/logos/scikitlearn.svg', altText: 'scikit-learn logo' },
          { name: 'OpenCV', logoSrc: '/assets/logos/opencv.svg', altText: 'OpenCV logo' },
        ],
      },
      {
        category: 'data science',
        tools: [
          { name: 'Pandas', logoSrc: '/assets/logos/pandas.svg', altText: 'Pandas logo' },
          { name: 'NumPy', logoSrc: '/assets/logos/numpy.svg', altText: 'NumPy logo' },
          { name: 'Plotly', logoSrc: '/assets/logos/plotly.svg', altText: 'Plotly logo' },
          { name: 'Jupyter', logoSrc: '/assets/logos/jupyter.svg', altText: 'Jupyter logo' },
          { name: 'Kaggle', logoSrc: '/assets/logos/kaggle.svg', altText: 'Kaggle logo' },
        ],
      },
      {
        category: 'design & workflow',
        tools: [
          { name: 'Figma', logoSrc: '/assets/logos/figma.svg', altText: 'Figma logo' },
          { name: 'Git', logoSrc: '/assets/logos/git.svg', altText: 'Git logo' },
          { name: 'GitHub', logoSrc: '/assets/logos/github.svg', altText: 'GitHub logo' },
          { name: 'Vercel', logoSrc: '/assets/logos/vercel.svg', altText: 'Vercel logo' },
        ],
      },
    ],
  },
  projects: {
    heading: 'Projects',
    items: [],
    placeholder: {
      badge: 'coming soon',
      text: 'Projects are in progress and will be added here soon.',
    },
  },
  experience: {
    heading: 'Experience',
    statement:
      'I’m an aspiring developer eager to apply my skills, build meaningful projects, and grow through new opportunities.',
    ctaText: 'Contact',
  },
  education: {
    heading: 'Education',
    specializations: ['Digital Business', 'Innovation'],
    timeline: [
      {
        year: '2023',
        title: 'Finished GED in 2023',
        subtitle: 'Completed GED diploma',
        status: 'completed',
        label: 'Completed',
        statusLabel: 'Completed',
      },
      {
        year: '2024',
        title: 'Enrolled at Tokyo International University in 2024',
        subtitle: 'Digital Business & Innovation',
        status: 'current',
        label: 'In progress',
        statusLabel: 'In progress',
        isUniversity: true,
      },
      {
        year: '2028',
        title: 'Expected graduation year: 2028',
        subtitle: 'Bachelor of Science (Expected)',
        status: 'upcoming',
        label: 'Expected',
        statusLabel: 'Expected',
      },
    ],
    timelineTabs: [
      {
        title: '2023',
        files: ['Finished GED in 2023'],
      },
      {
        title: '2024',
        files: ['Enrolled at Tokyo International University in 2024', 'Major: Digital Business & Innovation'],
      },
      {
        title: '2028',
        files: ['Expected graduation year: 2028'],
      },
    ],
    certificates: [
      {
        id: 'google-ai-cert',
        title: 'Google AI Professional Certificate',
        issuer: 'Google',
        issuerLogo: '/assets/issuers/google.svg',
        image: '/assets/certificates/google-ai.svg',
        issueDate: '2026',
        credentialId: '545Z2IG6REOZ',
        credentialUrl: 'https://coursera.org/verify/professional-cert/545Z2IG6REOZ',
        description:
          'Comprehensive 7-course professional certificate covering machine learning principles, applied artificial intelligence models, prompt engineering, and deploying automated AI workflows.',
        tags: ['Artificial Intelligence', 'Machine Learning', 'Prompt Engineering', 'Coursera', 'AI Pipelines'],
        kind: 'Professional Certificate',
        platform: 'Coursera',
        date: '2026',
        courses: 7,
        url: 'https://coursera.org/verify/professional-cert/545Z2IG6REOZ',
        logo: '/assets/issuers/google.svg',
      },
    ],
  },
  contact: {
    heading: 'Contact',
    items: [
      {
        type: 'email',
        label: 'Email',
        value: 'minnthanthmue04@gmail.com',
        href: 'mailto:minnthanthmue04@gmail.com',
      },
      {
        type: 'github',
        label: 'GitHub',
        value: 'github.com/minnthanthmue',
        href: 'https://github.com/minnthanthmue',
      },
      {
        type: 'linkedin',
        label: 'LinkedIn',
        value: 'linkedin.com/in/minn-thant-hmue',
        href: 'https://www.linkedin.com/in/minn-thant-hmue',
      },
    ],
    primaryCtaText: 'Email',
  },
  footer: {
    text: 'All rights reserved.',
    authorName: 'Minn Thant Hmue',
  },
};
