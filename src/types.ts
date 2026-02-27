export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  githubLink?: string;
  portfolioLink?: string;
  icon?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface StudentData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
  skills: string[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  resumeTemplate: ResumeTemplateType;
  portfolioTemplate: PortfolioTemplateType;
  accentColor?: string;
  fontStyle?: FontStyleType;
}

export type ResumeTemplateType = 'modern' | 'classic' | 'minimal' | 'bold' | 'executive' | 'creative' | 'tech';
export type PortfolioTemplateType = 'grid' | 'bento' | 'minimal' | 'editorial' | 'dark' | 'sidebar';
export type FontStyleType = 'sans' | 'serif' | 'mono' | 'display';
