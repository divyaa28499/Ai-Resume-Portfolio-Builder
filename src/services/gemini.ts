import { GoogleGenAI } from "@google/genai";
import { StudentData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateProfessionalSummary(data: Partial<StudentData>) {
  const model = "gemini-3-flash-preview";
  const prompt = `
    As a professional career coach, write a compelling 3-4 sentence professional summary for a student with the following details:
    Name: ${data.fullName}
    Skills: ${data.skills?.join(", ")}
    Top Projects: ${data.projects?.map(p => p.title).join(", ")}
    Education: ${data.education?.map(e => `${e.degree} in ${e.field}`).join(", ")}
    
    The summary should be tailored for job applications and highlight their potential and key strengths.
    Return only the summary text.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text;
}

export async function refineBulletPoint(text: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Refine the following resume bullet point to be more professional, action-oriented, and impactful. 
    Use strong action verbs and quantify achievements if possible.
    Original: "${text}"
    Return only the refined bullet point.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text;
}

export async function generateCoverLetter(data: StudentData, jobDescription: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Write a professional cover letter for the following student:
    ${JSON.stringify(data, null, 2)}
    
    Targeting this job description:
    ${jobDescription}
    
    The cover letter should be persuasive, highlight relevant projects and skills, and maintain a professional yet enthusiastic tone.
    Format it with standard cover letter sections (Contact Info, Salutation, Opening, Body Paragraphs, Closing).
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text;
}

export async function analyzeSkills(data: StudentData, careerGoal: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the skills of this student: ${data.skills.join(", ")}
    Based on their career goal: "${careerGoal}"
    
    Identify 3-5 critical missing skills they should acquire to be more competitive.
    For each missing skill, provide a brief 1-sentence explanation of why it's important.
    Return the response as a JSON array of objects with "skill" and "reason" properties.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  return JSON.parse(response.text || "[]");
}

export async function calculateMatchScore(data: StudentData, jobDescription: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the match between this student's resume and the job description.
    Resume Data: ${JSON.stringify(data)}
    Job Description: ${jobDescription}
    
    Calculate a match score from 0 to 100.
    Provide 3 specific suggestions to improve the resume for this specific job.
    Return the response as a JSON object with "score" (number) and "suggestions" (array of strings).
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  return JSON.parse(response.text || '{"score": 0, "suggestions": []}');
}
