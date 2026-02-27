import React from 'react';
import { StudentData, PortfolioTemplateType } from '../types';
import { ExternalLink, Github, Linkedin, Mail, Globe, Code, Cpu, Layers, Smartphone, Database, Terminal, Cloud, Zap, Heart, FileText } from 'lucide-react';
import { Card, cn } from './ui';

const ProjectIcon = ({ name, className }: { name?: string, className?: string }) => {
  if (!name) return <Code className={className} />;
  
  const icons: Record<string, any> = {
    Code, Globe, Cpu, Layers, Smartphone, Database, Terminal, Cloud, Zap, Heart
  };

  const IconComponent = icons[name];
  if (IconComponent) return <IconComponent className={className} />;
  
  // If it's a URL or Base64
  if (name.startsWith('http') || name.startsWith('data:image')) {
    return <img src={name} className={cn("object-contain", className)} alt="icon" referrerPolicy="no-referrer" />;
  }

  // If it's an emoji or plain text
  return <span className={cn("flex items-center justify-center font-bold", className)}>{name}</span>;
};

export default function PortfolioPreview({ data, template }: { data: StudentData, template: PortfolioTemplateType }) {
  const isBento = template === 'bento';
  const isMinimal = template === 'minimal';
  const isEditorial = template === 'editorial';
  const isDark = template === 'dark';
  const isSidebar = template === 'sidebar';

  const fontClass = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    display: 'font-sans tracking-tight font-medium',
  }[data.fontStyle || 'sans'];

  const accentColor = data.accentColor || '#10b981';

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      fontClass,
      isMinimal && "max-w-3xl mx-auto border-x border-zinc-100 bg-white text-zinc-900",
      isDark ? "bg-zinc-950 text-zinc-100" : "bg-white text-zinc-900",
      isSidebar && "flex"
    )}>
      {/* Sidebar Navigation (Only for sidebar template) */}
      {isSidebar && (
        <aside className="w-64 border-r border-zinc-200 h-screen sticky top-0 p-8 flex flex-col justify-between">
          <div>
            <div 
              className="w-12 h-12 text-white rounded-xl flex items-center justify-center font-bold mb-8"
              style={{ backgroundColor: accentColor }}
            >
              {data.fullName?.charAt(0)}
            </div>
            <nav className="space-y-4">
              <a href="#about" className="block text-sm font-bold text-zinc-400 hover:text-black transition-colors">About</a>
              <a href="#projects" className="block text-sm font-bold text-zinc-400 hover:text-black transition-colors">Projects</a>
              <a href="#experience" className="block text-sm font-bold text-zinc-400 hover:text-black transition-colors">Experience</a>
            </nav>
          </div>
          <div className="flex gap-4">
            {data.linkedin && <Linkedin className="w-4 h-4 text-zinc-400" />}
            {data.github && <Github className="w-4 h-4 text-zinc-400" />}
          </div>
        </aside>
      )}

      <div className={cn("flex-1", isSidebar && "p-12")}>
        {/* Hero Section */}
        <section id="about" className={cn(
          "px-8 py-24",
          !isMinimal && !isSidebar && "text-center max-w-5xl mx-auto",
          isEditorial && "grid md:grid-cols-2 gap-12 items-center text-left max-w-7xl mx-auto"
        )}>
          {isEditorial && (
            <div className="order-2 md:order-1">
              <h1 className="text-8xl font-black tracking-tighter leading-[0.8] mb-8 uppercase">
                {data.fullName?.split(' ')[0]} <br/>
                <span style={{ color: accentColor }} className="opacity-50">{data.fullName?.split(' ')[1]}</span>
              </h1>
              <p className="text-2xl text-zinc-500 leading-tight mb-8 italic font-serif">
                {data.summary}
              </p>
            </div>
          )}
          
          {!isMinimal && !isEditorial && !isSidebar && (
            <div 
              className={cn(
                "w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center text-3xl font-bold border",
                isDark ? "bg-zinc-900 border-zinc-800 text-zinc-500" : "bg-zinc-100 border-zinc-200 text-zinc-400"
              )}
              style={{ borderColor: isDark ? undefined : accentColor, color: isDark ? undefined : accentColor }}
            >
              {data.fullName?.charAt(0) || 'Y'}
            </div>
          )}

          {!isEditorial && (
            <>
              <h1 className={cn(
                "font-black tracking-tighter mb-6",
                isMinimal ? "text-4xl" : isSidebar ? "text-5xl" : "text-6xl",
                isDark && "text-white"
              )}>
                {data.fullName || 'Your Name'}
              </h1>
              <p className={cn(
                "text-xl text-zinc-500 leading-relaxed mb-10",
                !isMinimal && !isSidebar && "max-w-2xl mx-auto"
              )}>
                {data.summary || 'Aspiring professional looking to make an impact through innovative projects and dedicated work.'}
              </p>
            </>
          )}

          <div className={cn(
            "flex items-center gap-6",
            !isMinimal && !isEditorial && !isSidebar && "justify-center"
          )}>
            {data.linkedin && (
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black transition-colors" style={{ color: accentColor }}>
                <Linkedin className="w-6 h-6" />
              </a>
            )}
            {data.github && (
              <a href={data.github} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black transition-colors" style={{ color: accentColor }}>
                <Github className="w-6 h-6" />
              </a>
            )}
            {data.email && (
              <a href={`mailto:${data.email}`} className="text-zinc-400 hover:text-black transition-colors" style={{ color: accentColor }}>
                <Mail className="w-6 h-6" />
              </a>
            )}
          </div>

          {isEditorial && (
            <div className="order-1 md:order-2 aspect-[3/4] bg-zinc-100 rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/seed/editorial/800/1200" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          )}
        </section>

        {/* Projects Grid */}
        <section id="projects" className={cn(
          "px-8 py-24",
          !isMinimal && !isDark && "bg-zinc-50",
          isDark && "bg-zinc-900/50"
        )}>
          <div className={cn("max-w-5xl mx-auto", isEditorial && "max-w-7xl")}>
            <h2 className={cn(
              "text-3xl font-bold mb-12 tracking-tight",
              isEditorial && "text-7xl uppercase font-black"
            )}>
              Featured Projects
            </h2>
            <div className={cn(
              "grid gap-8",
              isBento ? "grid-cols-1 md:grid-cols-3" : isMinimal ? "grid-cols-1" : isEditorial ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
            )}>
              {data.projects.map((project, idx) => (
                <Card 
                  key={project.id} 
                  className={cn(
                    "group hover:shadow-xl transition-all duration-300",
                    isDark ? "bg-zinc-900 border-zinc-800" : "border-zinc-200/50",
                    isBento && idx === 0 && "md:col-span-2 md:row-span-2"
                  )}
                >
                  <div className="bg-zinc-100 overflow-hidden aspect-video">
                    <img 
                      src={`https://picsum.photos/seed/${project.id}/800/450`} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                          isDark ? "bg-zinc-800 text-zinc-100" : "bg-zinc-100 text-zinc-900"
                        )}
                        style={{ backgroundColor: isDark ? undefined : `${accentColor}10`, color: accentColor }}
                        >
                          <ProjectIcon name={project.icon} className="w-5 h-5" />
                        </div>
                        <h3 className={cn("text-xl font-bold", isDark && "text-white")}>{project.title}</h3>
                      </div>
                      <div className="flex gap-3">
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black transition-colors" style={{ color: accentColor }}>
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black transition-colors" style={{ color: accentColor }}>
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                        {project.portfolioLink && (
                          <a href={project.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black transition-colors" style={{ color: accentColor }}>
                            <FileText className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-zinc-500 mb-6 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className={cn(
                          "px-3 py-1 rounded-full text-xs font-semibold",
                          isDark ? "bg-zinc-800 text-zinc-400 border border-zinc-700" : "bg-white border border-zinc-200 text-zinc-600"
                        )}
                        style={{ borderColor: isDark ? undefined : accentColor, color: isDark ? undefined : accentColor }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Skills & Experience */}
        <section id="experience" className={cn("px-8 py-24 max-w-5xl mx-auto", isEditorial && "max-w-7xl")}>
          <div className={cn(
            "grid gap-20",
            !isMinimal && "md:grid-cols-2"
          )}>
            <div>
              <h2 className={cn(
                "text-3xl font-bold mb-8 tracking-tight",
                isEditorial && "text-5xl uppercase font-black"
              )}>
                Experience
              </h2>
              <div className="space-y-12">
                {data.experience.map((exp) => (
                  <div key={exp.id} className={cn(
                    "relative pl-8 border-l-2",
                    isDark ? "border-zinc-800" : "border-zinc-100"
                  )}
                  style={{ borderLeftColor: accentColor }}
                  >
                    <div className={cn(
                      "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2",
                      isDark ? "bg-zinc-950 border-zinc-700" : "bg-white border-zinc-900"
                    )} 
                    style={{ borderColor: accentColor }}
                    />
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">{exp.startDate} — {exp.endDate}</div>
                    <h3 className={cn("text-xl font-bold mb-1", isDark && "text-white")}>{exp.role}</h3>
                    <div className="text-zinc-500 font-medium mb-4">{exp.company}</div>
                    <p className="text-zinc-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className={cn(
                "text-3xl font-bold mb-8 tracking-tight",
                isEditorial && "text-5xl uppercase font-black"
              )}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {data.skills.map((skill, i) => (
                  <div key={i} className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium shadow-lg",
                    isDark ? "bg-zinc-100 text-zinc-900" : "bg-zinc-900 text-white shadow-black/5"
                  )}
                  style={{ backgroundColor: isDark ? undefined : accentColor }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
              
              <h2 className={cn(
                "text-3xl font-bold mt-16 mb-8 tracking-tight",
                isEditorial && "text-5xl uppercase font-black"
              )}>
                Education
              </h2>
              <div className="space-y-8">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className={cn("text-xl font-bold mb-1", isDark && "text-white")}>{edu.school}</h3>
                    <div className="text-zinc-500 font-medium">{edu.degree} in {edu.field}</div>
                    <div className="text-sm font-bold text-zinc-400 mt-2">{edu.graduationDate}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={cn(
          "px-8 py-12 border-t text-center",
          isDark ? "border-zinc-900" : "border-zinc-100"
        )}>
          <p className="text-zinc-400 text-sm">© {new Date().getFullYear()} {data.fullName}. Built with ElevateAI.</p>
        </footer>
      </div>
    </div>
  );
}
