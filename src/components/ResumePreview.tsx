import React from 'react';
import { StudentData, ResumeTemplateType } from '../types';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { cn } from './ui';

interface ResumePreviewProps {
  data: StudentData;
  template: ResumeTemplateType;
}

export default function ResumePreview({ data, template }: ResumePreviewProps) {
  const isBold = template === 'bold';
  const isMinimal = template === 'minimal';
  const isClassic = template === 'classic';
  const isExecutive = template === 'executive';
  const isCreative = template === 'creative';
  const isTech = template === 'tech';

  return (
    <div className={cn(
      "bg-white shadow-2xl w-full min-h-[1100px] p-[1in] text-zinc-900 leading-relaxed",
      (isClassic || isExecutive) ? "font-serif" : isTech ? "font-mono" : "font-sans",
      isTech && "text-xs"
    )}>
      {/* Header */}
      <header className={cn(
        "mb-8",
        isBold ? "bg-zinc-900 text-white p-8 -m-[1in] mb-8" : 
        isExecutive ? "text-center border-b border-zinc-200 pb-8" :
        isCreative ? "border-l-8 border-zinc-900 pl-8 pb-4" :
        isTech ? "border-2 border-zinc-900 p-4 mb-4" :
        "border-b-2 border-zinc-900 pb-6"
      )}>
        <h1 className={cn(
          "font-black uppercase tracking-tighter mb-4",
          isBold ? "text-5xl" : isExecutive ? "text-3xl tracking-widest" : "text-4xl"
        )}>
          {data.fullName || 'Your Name'}
        </h1>
        <div className={cn(
          "flex flex-wrap gap-y-2 gap-x-6 text-sm font-medium",
          isBold ? "text-zinc-400" : isExecutive ? "justify-center italic" : "text-zinc-600"
        )}>
          {data.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {data.email}
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              {data.phone}
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {data.location}
            </div>
          )}
          {data.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5" />
              {data.linkedin}
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className={cn("mb-8", isExecutive && "text-center max-w-2xl mx-auto")}>
          <h2 className={cn(
            "text-xs font-bold uppercase tracking-[0.2em] mb-3",
            isBold || isTech ? "text-zinc-900" : "text-zinc-400",
            isTech && "bg-zinc-900 text-white px-2 py-0.5 inline-block"
          )}>
            Professional Summary
          </h2>
          <p className={cn("text-sm text-zinc-700", isTech && "mt-2")}>{data.summary}</p>
        </section>
      )}

      <div className={cn(
        "grid gap-12",
        (isMinimal || isExecutive) ? "grid-cols-1" : "grid-cols-12"
      )}>
        <div className={cn(
          (isMinimal || isExecutive) ? "col-span-1" : "col-span-8",
          "space-y-8"
        )}>
          {/* Experience */}
          {data.experience.length > 0 && (
            <section>
              <h2 className={cn(
                "text-xs font-bold uppercase tracking-[0.2em] mb-4",
                isBold || isTech ? "text-zinc-900" : "text-zinc-400",
                isTech && "bg-zinc-900 text-white px-2 py-0.5 inline-block"
              )}>
                Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp) => (
                  <div key={exp.id} className={cn(isTech && "border-l border-zinc-200 pl-4")}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-zinc-900">{exp.role}</h3>
                      <span className="text-xs font-bold text-zinc-50">{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <div className="text-sm font-semibold text-zinc-600 mb-2">{exp.company}</div>
                    <p className="text-sm text-zinc-700 whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <section>
              <h2 className={cn(
                "text-xs font-bold uppercase tracking-[0.2em] mb-4",
                isBold || isTech ? "text-zinc-900" : "text-zinc-400",
                isTech && "bg-zinc-900 text-white px-2 py-0.5 inline-block"
              )}>
                Key Projects
              </h2>
              <div className="space-y-6">
                {data.projects.map((project) => (
                  <div key={project.id} className={cn(isTech && "border-l border-zinc-200 pl-4")}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-zinc-900">{project.title}</h3>
                      <div className="flex gap-2">
                        {project.githubLink && <span className="text-[10px] font-medium text-zinc-400 underline">{project.githubLink}</span>}
                        {project.link && <span className="text-[10px] font-medium text-zinc-400 underline">{project.link}</span>}
                        {project.portfolioLink && <span className="text-[10px] font-medium text-zinc-400 underline">{project.portfolioLink}</span>}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-700 mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className={cn(
          (isMinimal || isExecutive) ? "col-span-1 grid grid-cols-2 gap-8" : "col-span-4",
          "space-y-8"
        )}>
          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <h2 className={cn(
                "text-xs font-bold uppercase tracking-[0.2em] mb-4",
                isBold || isTech ? "text-zinc-900" : "text-zinc-400",
                isTech && "bg-zinc-900 text-white px-2 py-0.5 inline-block"
              )}>
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-sm font-bold text-zinc-900">{edu.school}</h3>
                    <div className="text-xs font-semibold text-zinc-600">{edu.degree}</div>
                    <div className="text-xs text-zinc-500">{edu.field}</div>
                    <div className="text-xs font-bold text-zinc-400 mt-1">{edu.graduationDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2 className={cn(
                "text-xs font-bold uppercase tracking-[0.2em] mb-4",
                isBold || isTech ? "text-zinc-900" : "text-zinc-400",
                isTech && "bg-zinc-900 text-white px-2 py-0.5 inline-block"
              )}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className={cn(
                    "text-xs font-medium px-2.5 py-1 rounded-md",
                    isTech ? "border border-zinc-900" : "bg-zinc-50 border border-zinc-200 text-zinc-700"
                  )}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
