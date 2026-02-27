import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Code, 
  User, 
  Plus, 
  Trash2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Layout as LayoutIcon,
  Download,
  Eye,
  PenTool,
  Target,
  CheckCircle2,
  AlertCircle,
  Globe,
  Cpu,
  Layers,
  Smartphone,
  Database,
  Terminal,
  Cloud,
  Zap,
  Heart,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { StudentData, Project, Experience, Education, ResumeTemplateType, PortfolioTemplateType, FontStyleType } from './types';
import { Button, Card, Input, Textarea, cn } from './components/ui';
import { 
  generateProfessionalSummary, 
  refineBulletPoint, 
  generateCoverLetter, 
  analyzeSkills, 
  calculateMatchScore 
} from './services/gemini';
import ResumePreview from './components/ResumePreview';
import PortfolioPreview from './components/PortfolioPreview';

const initialData: StudentData = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  skills: [],
  projects: [],
  experience: [],
  education: [],
  resumeTemplate: 'modern',
  portfolioTemplate: 'grid',
  accentColor: '#10b981', // Default emerald
  fontStyle: 'sans',
};

export default function App() {
  const [step, setStep] = useState<'landing' | 'builder' | 'preview'>('landing');
  const [activeTab, setActiveTab] = useState<'personal' | 'education' | 'experience' | 'projects' | 'skills' | 'summary' | 'analysis' | 'cover-letter'>('personal');
  const [data, setData] = useState<StudentData>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<'resume' | 'portfolio' | 'cover-letter'>('resume');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [missingSkills, setMissingSkills] = useState<{skill: string, reason: string}[]>([]);
  const [matchResult, setMatchResult] = useState<{score: number, suggestions: string[]} | null>(null);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

  const allTechs = Array.from(new Set(data.projects.flatMap(p => p.technologies))).sort();

  const filteredProjects = selectedTechs.length > 0
    ? data.projects.filter(p => p.technologies.some(t => selectedTechs.includes(t)))
    : data.projects;

  const updateData = (updates: Partial<StudentData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const addItem = (key: 'projects' | 'experience' | 'education', item: any) => {
    setData(prev => ({ ...prev, [key]: [...prev[key], { ...item, id: Math.random().toString(36).substr(2, 9) }] }));
  };

  const removeItem = (key: 'projects' | 'experience' | 'education', id: string) => {
    setData(prev => ({ ...prev, [key]: prev[key].filter((item: any) => item.id !== id) }));
  };

  const handleIconUpload = (projectId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newList = data.projects.map(p => p.id === projectId ? { ...p, icon: base64String } : p);
      updateData({ projects: newList });
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const summary = await generateProfessionalSummary(data);
      if (summary) updateData({ summary });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (currentView === 'resume' && resumeRef.current) {
      const element = resumeRef.current;
      const opt = {
        margin: 0,
        filename: `${data.fullName || 'Resume'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
      };
      html2pdf().set(opt).from(element).save();
    } else if (currentView === 'cover-letter') {
      // Simple text download for cover letter
      const element = document.createElement("a");
      const file = new Blob([coverLetter], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "Cover_Letter.txt";
      document.body.appendChild(element);
      element.click();
    }
  };
  const handleGenerateCoverLetter = async () => {
    setIsGenerating(true);
    try {
      const [letter, match] = await Promise.all([
        generateCoverLetter(data, jobDescription),
        calculateMatchScore(data, jobDescription)
      ]);
      if (letter) setCoverLetter(letter);
      if (match) setMatchResult(match);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeSkills = async () => {
    setIsGenerating(true);
    try {
      const skills = await analyzeSkills(data, careerGoal);
      if (skills) setMissingSkills(skills);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-[#FDFCFB] text-zinc-900 font-sans">
        <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            ElevateAI
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-zinc-500">
            <a href="#" className="hover:text-black transition-colors">Features</a>
            <a href="#" className="hover:text-black transition-colors">Templates</a>
            <Button onClick={() => setStep('builder')} size="sm">Get Started</Button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-semibold uppercase tracking-wider mb-6">
                <Sparkles className="w-3 h-3" />
                AI-Powered Career Tools
              </div>
              <h1 className="text-7xl font-bold leading-[1.1] tracking-tight mb-8">
                Build a career that <span className="text-zinc-400 italic">stands out.</span>
              </h1>
              <p className="text-xl text-zinc-500 mb-10 max-w-lg leading-relaxed">
                ElevateAI helps students transform their projects and skills into professional resumes, cover letters, and portfolios in minutes.
              </p>
              <div className="flex items-center gap-4">
                <Button onClick={() => setStep('builder')} size="lg" className="rounded-full px-8">
                  Start Building Free
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  View Examples
                </Button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-zinc-100 to-transparent rounded-3xl -z-10 blur-2xl opacity-50" />
              <Card className="p-2 bg-zinc-50/50 border-zinc-200/50 backdrop-blur-sm">
                <img 
                  src="https://picsum.photos/seed/resume/800/1000" 
                  alt="Resume Preview" 
                  className="rounded-xl shadow-2xl border border-zinc-200"
                  referrerPolicy="no-referrer"
                />
              </Card>
              
              {/* Floating UI elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -right-8 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Sparkles className="text-emerald-600 w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">AI Refined</div>
                  <div className="text-sm font-semibold">Impactful Bullet Points</div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <LayoutIcon className="text-blue-600 w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Portfolio</div>
                  <div className="text-sm font-semibold">Ready to Share</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Builder Header */}
      <header className="bg-white border-bottom border-zinc-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setStep('landing')}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="h-6 w-[1px] bg-zinc-200" />
          <h2 className="font-bold text-lg tracking-tight">Resume Builder</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setStep('preview')}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-right border-zinc-200 flex flex-col p-4 gap-2">
          {[
            { id: 'personal', label: 'Personal Info', icon: User },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'experience', label: 'Experience', icon: Briefcase },
            { id: 'projects', label: 'Projects', icon: Code },
            { id: 'skills', label: 'Skills', icon: Sparkles },
            { id: 'analysis', label: 'Skill Analysis', icon: Target },
            { id: 'summary', label: 'AI Summary', icon: PenTool },
            { id: 'cover-letter', label: 'Cover Letter', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id 
                  ? "bg-black text-white shadow-lg shadow-black/10" 
                  : "text-zinc-500 hover:bg-zinc-50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Form Area */}
        <section className="flex-1 overflow-y-auto p-12">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'personal' && (
                <motion.div 
                  key="personal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2">Personal Information</h3>
                    <p className="text-zinc-500">How can employers contact you?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-zinc-700">Full Name</label>
                      <Input 
                        value={data.fullName} 
                        onChange={e => updateData({ fullName: e.target.value })}
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-zinc-700">Email Address</label>
                      <Input 
                        value={data.email} 
                        onChange={e => updateData({ email: e.target.value })}
                        placeholder="john@example.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-zinc-700">Phone Number</label>
                      <Input 
                        value={data.phone} 
                        onChange={e => updateData({ phone: e.target.value })}
                        placeholder="+1 (555) 000-0000" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-zinc-700">Location</label>
                      <Input 
                        value={data.location} 
                        onChange={e => updateData({ location: e.target.value })}
                        placeholder="New York, NY" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700">LinkedIn Profile</label>
                    <Input 
                      value={data.linkedin} 
                      onChange={e => updateData({ linkedin: e.target.value })}
                      placeholder="linkedin.com/in/johndoe" 
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'analysis' && (
                <motion.div 
                  key="analysis"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2">Skill Gap Analysis</h3>
                    <p className="text-zinc-500">Find out what skills you need for your dream job.</p>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-zinc-700">What is your career goal?</label>
                    <Input 
                      placeholder="e.g. Senior Frontend Engineer at a Fintech startup" 
                      value={careerGoal}
                      onChange={e => setCareerGoal(e.target.value)}
                    />
                    <Button 
                      onClick={handleAnalyzeSkills} 
                      disabled={isGenerating || !careerGoal}
                      className="w-full"
                    >
                      {isGenerating ? 'Analyzing...' : 'Analyze Skills'}
                    </Button>
                  </div>

                  {missingSkills.length > 0 && (
                    <div className="space-y-4 mt-8">
                      <h4 className="font-bold text-zinc-900">Recommended Skills to Learn:</h4>
                      {missingSkills.map((item, i) => (
                        <Card key={i} className="p-4 border-l-4 border-l-emerald-500">
                          <div className="font-bold text-zinc-900 mb-1">{item.skill}</div>
                          <p className="text-sm text-zinc-500">{item.reason}</p>
                        </Card>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'cover-letter' && (
                <motion.div 
                  key="cover-letter"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2">AI Cover Letter Generator</h3>
                    <p className="text-zinc-500">Tailor your application to a specific job description.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-zinc-700">Job Description</label>
                    <Textarea 
                      placeholder="Paste the job description here..."
                      value={jobDescription}
                      onChange={e => setJobDescription(e.target.value)}
                      className="min-h-[200px]"
                    />
                    <Button 
                      onClick={handleGenerateCoverLetter} 
                      disabled={isGenerating || !jobDescription}
                      className="w-full"
                    >
                      {isGenerating ? 'Generating...' : 'Generate Cover Letter & Match Score'}
                    </Button>
                  </div>

                  {matchResult && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      <Card className="p-6 bg-zinc-900 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-zinc-400 uppercase tracking-widest text-xs">Match Score</h4>
                          <div className={cn(
                            "text-2xl font-black",
                            matchResult.score > 80 ? "text-emerald-400" : matchResult.score > 50 ? "text-yellow-400" : "text-red-400"
                          )}>
                            {matchResult.score}%
                          </div>
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${matchResult.score}%` }}
                            className={cn(
                              "h-full",
                              matchResult.score > 80 ? "bg-emerald-400" : matchResult.score > 50 ? "bg-yellow-400" : "bg-red-400"
                            )}
                          />
                        </div>
                      </Card>
                      <Card className="p-6 border-zinc-200">
                        <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-zinc-400" />
                          Improvement Suggestions
                        </h4>
                        <ul className="space-y-2">
                          {matchResult.suggestions.map((s, i) => (
                            <li key={i} className="text-xs text-zinc-500 flex gap-2">
                              <span className="text-zinc-300">•</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </div>
                  )}

                  {coverLetter && (
                    <div className="mt-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-zinc-900">Generated Cover Letter</h4>
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                          <Download className="w-4 h-4 mr-2" />
                          Download TXT
                        </Button>
                      </div>
                      <Card className="p-8 bg-white shadow-sm font-serif whitespace-pre-wrap text-sm leading-relaxed border-zinc-200">
                        {coverLetter}
                      </Card>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'summary' && (
                <motion.div 
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2">Professional Summary</h3>
                    <p className="text-zinc-500">A brief overview of your career goals and strengths.</p>
                  </div>
                  <div className="bg-zinc-900 rounded-2xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-zinc-400" />
                        <span className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">AI Assistant</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={handleGenerateSummary}
                        disabled={isGenerating}
                        className="bg-white/10 hover:bg-white/20 border-none text-white"
                      >
                        {isGenerating ? 'Generating...' : 'Generate with AI'}
                      </Button>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Our AI will analyze your skills, projects, and education to craft a professional summary that highlights your unique value proposition.
                    </p>
                  </div>
                  <Textarea 
                    value={data.summary} 
                    onChange={e => updateData({ summary: e.target.value })}
                    placeholder="Write your professional summary here..."
                    className="min-h-[200px]"
                  />
                </motion.div>
              )}

              {activeTab === 'education' && (
                <motion.div 
                  key="education"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Education</h3>
                      <p className="text-zinc-500">Your academic background.</p>
                    </div>
                    <Button onClick={() => addItem('education', { school: '', degree: '', field: '', graduationDate: '' })}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                  {data.education.map((edu) => (
                    <Card key={edu.id} className="p-6 space-y-4 relative group">
                      <button 
                        onClick={() => removeItem('education', edu.id)}
                        className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          placeholder="School Name" 
                          value={edu.school}
                          onChange={e => {
                            const newList = data.education.map(item => item.id === edu.id ? { ...item, school: e.target.value } : item);
                            updateData({ education: newList });
                          }}
                        />
                        <Input 
                          placeholder="Degree (e.g. Bachelor of Science)" 
                          value={edu.degree}
                          onChange={e => {
                            const newList = data.education.map(item => item.id === edu.id ? { ...item, degree: e.target.value } : item);
                            updateData({ education: newList });
                          }}
                        />
                        <Input 
                          placeholder="Field of Study" 
                          value={edu.field}
                          onChange={e => {
                            const newList = data.education.map(item => item.id === edu.id ? { ...item, field: e.target.value } : item);
                            updateData({ education: newList });
                          }}
                        />
                        <Input 
                          placeholder="Graduation Date" 
                          value={edu.graduationDate}
                          onChange={e => {
                            const newList = data.education.map(item => item.id === edu.id ? { ...item, graduationDate: e.target.value } : item);
                            updateData({ education: newList });
                          }}
                        />
                      </div>
                    </Card>
                  ))}
                </motion.div>
              )}

              {activeTab === 'experience' && (
                <motion.div 
                  key="experience"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Experience</h3>
                      <p className="text-zinc-500">Internships, part-time jobs, or volunteer work.</p>
                    </div>
                    <Button onClick={() => addItem('experience', { company: '', role: '', startDate: '', endDate: '', description: '' })}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                  {data.experience.map((exp) => (
                    <Card key={exp.id} className="p-6 space-y-4 relative group">
                      <button 
                        onClick={() => removeItem('experience', exp.id)}
                        className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          placeholder="Company" 
                          value={exp.company}
                          onChange={e => {
                            const newList = data.experience.map(item => item.id === exp.id ? { ...item, company: e.target.value } : item);
                            updateData({ experience: newList });
                          }}
                        />
                        <Input 
                          placeholder="Role" 
                          value={exp.role}
                          onChange={e => {
                            const newList = data.experience.map(item => item.id === exp.id ? { ...item, role: e.target.value } : item);
                            updateData({ experience: newList });
                          }}
                        />
                        <Input 
                          placeholder="Start Date" 
                          value={exp.startDate}
                          onChange={e => {
                            const newList = data.experience.map(item => item.id === exp.id ? { ...item, startDate: e.target.value } : item);
                            updateData({ experience: newList });
                          }}
                        />
                        <Input 
                          placeholder="End Date" 
                          value={exp.endDate}
                          onChange={e => {
                            const newList = data.experience.map(item => item.id === exp.id ? { ...item, endDate: e.target.value } : item);
                            updateData({ experience: newList });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-zinc-700">Description</label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-[10px] uppercase tracking-widest font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            onClick={async () => {
                              const refined = await refineBulletPoint(exp.description);
                              if (refined) {
                                const newList = data.experience.map(item => item.id === exp.id ? { ...item, description: refined } : item);
                                updateData({ experience: newList });
                              }
                            }}
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            Refine with AI
                          </Button>
                        </div>
                        <Textarea 
                          placeholder="Description of your responsibilities and achievements..." 
                          value={exp.description}
                          onChange={e => {
                            const newList = data.experience.map(item => item.id === exp.id ? { ...item, description: e.target.value } : item);
                            updateData({ experience: newList });
                          }}
                        />
                      </div>
                    </Card>
                  ))}
                </motion.div>
              )}

              {activeTab === 'projects' && (
                <motion.div 
                  key="projects"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Projects</h3>
                      <p className="text-zinc-500">Showcase your best work.</p>
                    </div>
                    <Button onClick={() => addItem('projects', { title: '', description: '', technologies: [], link: '', icon: 'Code' })}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </div>

                  {allTechs.length > 0 && (
                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Filter Preview by Tech</label>
                        {selectedTechs.length > 0 && (
                          <button 
                            onClick={() => setSelectedTechs([])}
                            className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-wider"
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {allTechs.map(tech => (
                          <button
                            key={tech}
                            onClick={() => {
                              setSelectedTechs(prev => 
                                prev.includes(tech) 
                                  ? prev.filter(t => t !== tech) 
                                  : [...prev, tech]
                              );
                            }}
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium transition-all",
                              selectedTechs.includes(tech)
                                ? "bg-zinc-900 text-white"
                                : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400"
                            )}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.projects.map((project) => (
                    <Card key={project.id} className="p-6 space-y-4 relative group">
                      <button 
                        onClick={() => removeItem('projects', project.id)}
                        className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Input 
                        placeholder="Project Title" 
                        value={project.title}
                        onChange={e => {
                          const newList = data.projects.map(item => item.id === project.id ? { ...item, title: e.target.value } : item);
                          updateData({ projects: newList });
                        }}
                      />
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-zinc-700">Project Icon</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'Code', icon: Code },
                            { name: 'Globe', icon: Globe },
                            { name: 'Cpu', icon: Cpu },
                            { name: 'Layers', icon: Layers },
                            { name: 'Smartphone', icon: Smartphone },
                            { name: 'Database', icon: Database },
                            { name: 'Terminal', icon: Terminal },
                            { name: 'Cloud', icon: Cloud },
                            { name: 'Zap', icon: Zap },
                            { name: 'Heart', icon: Heart }
                          ].map((item) => (
                            <button
                              key={item.name}
                              onClick={() => {
                                const newList = data.projects.map(p => p.id === project.id ? { ...p, icon: item.name } : p);
                                updateData({ projects: newList });
                              }}
                              className={cn(
                                "p-2 rounded-lg border transition-all",
                                project.icon === item.name 
                                  ? "bg-zinc-900 border-zinc-900 text-white" 
                                  : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-400"
                              )}
                            >
                              <item.icon className="w-4 h-4" />
                            </button>
                          ))}
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleIconUpload(project.id, file);
                              }}
                            />
                            <div className={cn(
                              "p-2 rounded-lg border transition-all flex items-center justify-center",
                              project.icon?.startsWith('data:image')
                                ? "bg-zinc-900 border-zinc-900 text-white"
                                : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-400"
                            )}>
                              <Upload className="w-4 h-4" />
                            </div>
                          </label>
                        </div>
                        <Input 
                          placeholder="Or paste an emoji or icon URL..." 
                          value={project.icon && !['Code', 'Globe', 'Cpu', 'Layers', 'Smartphone', 'Database', 'Terminal', 'Cloud', 'Zap', 'Heart'].includes(project.icon) ? project.icon : ''}
                          onChange={e => {
                            const newList = data.projects.map(item => item.id === project.id ? { ...item, icon: e.target.value } : item);
                            updateData({ projects: newList });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-zinc-700">Description</label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-[10px] uppercase tracking-widest font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            onClick={async () => {
                              const refined = await refineBulletPoint(project.description);
                              if (refined) {
                                const newList = data.projects.map(item => item.id === project.id ? { ...item, description: refined } : item);
                                updateData({ projects: newList });
                              }
                            }}
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            Refine with AI
                          </Button>
                        </div>
                        <Textarea 
                          placeholder="Describe what you built and the impact it had..." 
                          value={project.description}
                          onChange={e => {
                            const newList = data.projects.map(item => item.id === project.id ? { ...item, description: e.target.value } : item);
                            updateData({ projects: newList });
                          }}
                        />
                      </div>
                      <Input 
                        placeholder="Technologies (comma separated)" 
                        value={project.technologies.join(', ')}
                        onChange={e => {
                          const newList = data.projects.map(item => item.id === project.id ? { ...item, technologies: e.target.value.split(',').map(s => s.trim()) } : item);
                          updateData({ projects: newList });
                        }}
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <Input 
                          placeholder="GitHub Link" 
                          value={project.githubLink || ''}
                          onChange={e => {
                            const newList = data.projects.map(item => item.id === project.id ? { ...item, githubLink: e.target.value } : item);
                            updateData({ projects: newList });
                          }}
                        />
                        <Input 
                          placeholder="Live Demo" 
                          value={project.link}
                          onChange={e => {
                            const newList = data.projects.map(item => item.id === project.id ? { ...item, link: e.target.value } : item);
                            updateData({ projects: newList });
                          }}
                        />
                        <Input 
                          placeholder="Portfolio Link" 
                          value={project.portfolioLink || ''}
                          onChange={e => {
                            const newList = data.projects.map(item => item.id === project.id ? { ...item, portfolioLink: e.target.value } : item);
                            updateData({ projects: newList });
                          }}
                        />
                      </div>
                    </Card>
                  ))}
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div 
                  key="skills"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2">Skills</h3>
                    <p className="text-zinc-500">What are you good at?</p>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-zinc-700">Technical & Soft Skills</label>
                    <Textarea 
                      placeholder="Enter skills separated by commas (e.g. React, Python, Project Management, Public Speaking)"
                      value={data.skills.join(', ')}
                      onChange={e => updateData({ skills: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '') })}
                      className="min-h-[150px]"
                    />
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Live Preview (Mini) */}
        <aside className="w-[400px] bg-zinc-100 border-left border-zinc-200 p-6 overflow-y-auto hidden xl:block">
          <div className="sticky top-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Live Preview</h4>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-zinc-300" />
                <div className="w-2 h-2 rounded-full bg-zinc-300" />
                <div className="w-2 h-2 rounded-full bg-zinc-300" />
              </div>
            </div>
            <div className="scale-[0.4] origin-top transform-gpu shadow-2xl">
              <ResumePreview data={data} template={data.resumeTemplate} />
            </div>
          </div>
        </aside>
      </main>

      {/* Full Preview Modal */}
      <AnimatePresence>
        {step === 'preview' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <header className="px-8 py-4 border-bottom border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Button variant="ghost" size="sm" onClick={() => setStep('builder')}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Editor
                </Button>
                <div className="flex bg-zinc-100 p-1 rounded-xl">
                  {[
                    { id: 'resume', label: 'Resume', icon: FileText },
                    { id: 'portfolio', label: 'Portfolio', icon: LayoutIcon },
                    { id: 'cover-letter', label: 'Cover Letter', icon: Sparkles },
                  ].map((view) => (
                    <button
                      key={view.id}
                      onClick={() => setCurrentView(view.id as any)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        currentView === view.id ? "bg-white shadow-sm text-black" : "text-zinc-500 hover:text-zinc-700"
                      )}
                    >
                      <view.icon className="w-4 h-4" />
                      {view.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {currentView === 'resume' && (
                  <select 
                    className="bg-zinc-100 border-none rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-0"
                    value={data.resumeTemplate}
                    onChange={(e) => updateData({ resumeTemplate: e.target.value as ResumeTemplateType })}
                  >
                    <option value="modern">Modern Template</option>
                    <option value="classic">Classic Template</option>
                    <option value="minimal">Minimal Template</option>
                    <option value="bold">Bold Template</option>
                    <option value="executive">Executive Template</option>
                    <option value="creative">Creative Template</option>
                    <option value="tech">Tech Template</option>
                  </select>
                )}
                {currentView === 'portfolio' && (
                  <>
                    <div className="flex items-center gap-2 px-3 border-r border-zinc-200">
                      {[
                        '#10b981', // emerald
                        '#3b82f6', // blue
                        '#8b5cf6', // violet
                        '#f43f5e', // rose
                        '#f59e0b', // amber
                        '#18181b', // zinc-900
                      ].map(color => (
                        <button
                          key={color}
                          onClick={() => updateData({ accentColor: color })}
                          className={cn(
                            "w-5 h-5 rounded-full border-2 transition-all",
                            data.accentColor === color ? "border-zinc-900 scale-110" : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <select 
                      className="bg-zinc-100 border-none rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-0"
                      value={data.fontStyle}
                      onChange={(e) => updateData({ fontStyle: e.target.value as FontStyleType })}
                    >
                      <option value="sans">Sans Serif</option>
                      <option value="serif">Serif</option>
                      <option value="mono">Monospace</option>
                      <option value="display">Display</option>
                    </select>
                    <select 
                      className="bg-zinc-100 border-none rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-0"
                      value={data.portfolioTemplate}
                      onChange={(e) => updateData({ portfolioTemplate: e.target.value as PortfolioTemplateType })}
                    >
                      <option value="grid">Grid Layout</option>
                      <option value="bento">Bento Layout</option>
                      <option value="minimal">Minimal Layout</option>
                      <option value="editorial">Editorial Layout</option>
                      <option value="dark">Dark Layout</option>
                      <option value="sidebar">Sidebar Layout</option>
                    </select>
                  </>
                )}
                <Button size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </header>
            
            <div className="flex-1 overflow-y-auto bg-zinc-50 p-12">
              <div className="max-w-4xl mx-auto">
                {currentView === 'resume' && (
                  <div ref={resumeRef}>
                    <ResumePreview data={{ ...data, projects: filteredProjects }} template={data.resumeTemplate} />
                  </div>
                )}
                {currentView === 'portfolio' && <PortfolioPreview data={{ ...data, projects: filteredProjects }} template={data.portfolioTemplate} />}
                {currentView === 'cover-letter' && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-3 gap-8">
                      <Card className="p-8 md:col-span-2">
                        <h3 className="text-xl font-bold mb-4">Generate Tailored Cover Letter</h3>
                        <p className="text-zinc-500 mb-6">Paste the job description below and our AI will write a custom cover letter based on your profile.</p>
                        <Textarea 
                          placeholder="Paste job description here..."
                          value={jobDescription}
                          onChange={e => setJobDescription(e.target.value)}
                          className="mb-4"
                        />
                        <Button 
                          onClick={handleGenerateCoverLetter} 
                          disabled={isGenerating || !jobDescription}
                          className="w-full"
                        >
                          {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
                        </Button>
                      </Card>
                      
                      <div className="space-y-6">
                        {matchResult && (
                          <Card className="p-6 bg-zinc-900 text-white">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-bold text-zinc-400 uppercase tracking-widest text-xs">Match Score</h4>
                              <div className={cn(
                                "text-2xl font-black",
                                matchResult.score > 80 ? "text-emerald-400" : matchResult.score > 50 ? "text-yellow-400" : "text-red-400"
                              )}>
                                {matchResult.score}%
                              </div>
                            </div>
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-6">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${matchResult.score}%` }}
                                className={cn(
                                  "h-full",
                                  matchResult.score > 80 ? "bg-emerald-400" : matchResult.score > 50 ? "bg-yellow-400" : "bg-red-400"
                                )}
                              />
                            </div>
                            <div className="space-y-4">
                              <h5 className="text-sm font-bold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-zinc-400" />
                                AI Suggestions
                              </h5>
                              <ul className="space-y-2">
                                {matchResult.suggestions.map((s, i) => (
                                  <li key={i} className="text-xs text-zinc-400 flex gap-2">
                                    <span className="text-zinc-600">•</span>
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </Card>
                        )}
                      </div>
                    </div>
                    {coverLetter && (
                      <Card className="p-12 bg-white shadow-xl font-serif whitespace-pre-wrap">
                        {coverLetter}
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
