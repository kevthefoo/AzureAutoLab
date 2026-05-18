import data from "@/data/quiz-questions.json";

export interface Question {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: string;
  domain: string;
  explanation: string;
  tip: string;
}

const questions: Question[] = data;

export function getQuestions(): Question[] {
  return questions;
}

export function getQuestionsByDomain(domain: string): Question[] {
  if (domain === "All") return questions;
  return questions.filter((q) => q.domain === domain);
}

export function getShuffledQuestions(domain: string): Question[] {
  const filtered = getQuestionsByDomain(domain);
  const shuffled = [...filtered];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
