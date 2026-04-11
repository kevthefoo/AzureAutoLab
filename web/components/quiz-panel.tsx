"use client";

import { useState } from "react";
import { getShuffledQuestions, type Question } from "@/lib/quiz-questions";

const DOMAINS = [
  "All",
  "Identity & Governance",
  "Storage",
  "Compute",
  "Networking",
  "Monitoring & Backup",
];

type Phase = "idle" | "question" | "answered";

export default function QuizPanel() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [domain, setDomain] = useState("All");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQuestion = questions[currentIndex] ?? null;
  const totalQuestions = questions.length;

  function startQuiz() {
    const shuffled = getShuffledQuestions(domain);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setSelectedAnswer(null);
    setIsCorrect(null);
    setPhase("question");
  }

  function handleDomainChange(newDomain: string) {
    setDomain(newDomain);
    setPhase("idle");
    setQuestions([]);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setSelectedAnswer(null);
    setIsCorrect(null);
  }

  function nextQuestion() {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setPhase("question");
    }
  }

  function submitAnswer(selected: string) {
    if (!currentQuestion || phase === "answered") return;

    setSelectedAnswer(selected);
    const correct = selected === currentQuestion.correct;
    setIsCorrect(correct);
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
    setPhase("answered");
  }

  const optionKeys = ["A", "B", "C", "D"] as const;
  const isFinished = phase === "answered" && currentIndex + 1 >= totalQuestions;

  return (
    <div className="space-y-6">
      {/* Top bar: domain filter + progress + score */}
      <div className="flex items-center justify-between">
        <select
          value={domain}
          onChange={(e) => handleDomainChange(e.target.value)}
          disabled={phase === "question" && !selectedAnswer}
          className="bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent disabled:opacity-50 cursor-pointer"
        >
          {DOMAINS.map((d) => (
            <option key={d} value={d}>
              {d === "All" ? "All Domains" : d}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-4 text-sm text-text-secondary">
          {totalQuestions > 0 && (
            <span>
              {currentIndex + 1}/{totalQuestions}
            </span>
          )}
          {score.total > 0 && (
            <span>
              Score:{" "}
              <span className="text-status-passed font-bold">
                {score.correct}
              </span>
              /{score.total}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {totalQuestions > 0 && (
        <div className="bg-border rounded-full h-1.5">
          <div
            className="bg-accent h-1.5 rounded-full transition-all"
            style={{
              width: `${((currentIndex + (phase === "answered" ? 1 : 0)) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      )}

      {/* Idle state */}
      {phase === "idle" && (
        <div className="bg-bg-surface border border-border rounded-lg p-12 text-center">
          <p className="text-text-secondary mb-2">
            Test your AZ-104 knowledge with {domain === "All" ? "100" : ""}{" "}
            multiple-choice questions.
          </p>
          <p className="text-text-secondary/60 text-xs mb-6">
            {domain === "All"
              ? "Questions from all 5 AZ-104 domains"
              : `Questions from ${domain}`}
          </p>
          <button
            onClick={startQuiz}
            className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            Start Quiz
          </button>
        </div>
      )}

      {/* Question display */}
      {(phase === "question" || phase === "answered") && currentQuestion && (
        <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
          {/* Question header */}
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <span className="text-accent text-xs font-semibold uppercase tracking-wider">
              {currentQuestion.domain}
            </span>
            <span className="text-text-secondary/50 text-xs">
              Q{currentIndex + 1}
            </span>
          </div>

          {/* Question text */}
          <div className="px-5 py-4 border-b border-border">
            <p className="text-text-primary leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options */}
          <div className="p-5 space-y-3">
            {optionKeys.map((key) => {
              const isSelected = selectedAnswer === key;
              const isCorrectOption = currentQuestion.correct === key;
              const answered = phase === "answered";

              let classes =
                "w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors flex items-start gap-3";

              if (!answered) {
                classes +=
                  " border-border hover:border-accent hover:bg-accent/5 cursor-pointer";
              } else if (isCorrectOption) {
                classes +=
                  " border-status-passed bg-status-passed/10 text-status-passed";
              } else if (isSelected && !isCorrectOption) {
                classes += " border-red-500 bg-red-500/10 text-red-400";
              } else {
                classes += " border-border opacity-50";
              }

              return (
                <button
                  key={key}
                  onClick={() => submitAnswer(key)}
                  disabled={answered}
                  className={classes}
                >
                  <span className="font-bold shrink-0">{key}.</span>
                  <span>{currentQuestion.options[key]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Answer feedback + explanation */}
      {phase === "answered" && currentQuestion && (
        <div className="space-y-4">
          {/* Correct/Incorrect banner */}
          <div
            className={`rounded-lg px-5 py-3 text-sm font-medium ${
              isCorrect
                ? "bg-status-passed/10 border border-status-passed/30 text-status-passed"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            {isCorrect
              ? "Correct!"
              : `Incorrect — the answer is ${currentQuestion.correct}.`}
          </div>

          {/* Explanation */}
          <div className="bg-bg-surface border border-border rounded-lg px-5 py-4">
            <p className="text-text-secondary text-sm leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>

          {/* Next question / Finish */}
          <div className="flex items-center gap-3">
            {!isFinished ? (
              <button
                onClick={nextQuestion}
                className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Next Question
              </button>
            ) : (
              <div className="bg-bg-surface border border-border rounded-lg px-5 py-4 w-full text-center">
                <p className="text-text-primary font-medium mb-1">
                  Quiz Complete!
                </p>
                <p className="text-text-secondary text-sm mb-4">
                  You scored {score.correct}/{score.total} (
                  {Math.round((score.correct / score.total) * 100)}%)
                </p>
                <button
                  onClick={startQuiz}
                  className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Restart Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
