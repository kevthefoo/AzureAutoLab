"use client";

import { useState, useEffect } from "react";
import {
  getShuffledQuestions,
  getQuestionsByDomain,
  type Question,
} from "@/lib/quiz-questions";

const DOMAINS = [
  "All",
  "Identity & Governance",
  "Storage",
  "Compute",
  "Networking",
  "Monitoring & Backup",
];

const STORAGE_KEY = "az104-quiz-answers";

interface AnswerRecord {
  questionId: number;
  selected: string;
  correct: boolean;
}

function loadAnswers(): AnswerRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAnswers(answers: AnswerRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}

type Tab = "quiz" | "review";
type Phase = "idle" | "question" | "answered";

export default function QuizPanel() {
  const [tab, setTab] = useState<Tab>("quiz");
  const [phase, setPhase] = useState<Phase>("idle");
  const [domain, setDomain] = useState("All");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [reviewDomain, setReviewDomain] = useState("All");

  // Load answers from localStorage on mount
  useEffect(() => {
    setAnswers(loadAnswers());
  }, []);

  const answeredIds = new Set(answers.map((a) => a.questionId));
  const currentQuestion = questions[currentIndex] ?? null;
  const totalQuestions = questions.length;

  // Count remaining unanswered questions for current domain
  const allForDomain = getQuestionsByDomain(domain);
  const remainingCount = allForDomain.filter(
    (q) => !answeredIds.has(q.id),
  ).length;

  function startQuiz() {
    const shuffled = getShuffledQuestions(domain);
    const unanswered = shuffled.filter((q) => !answeredIds.has(q.id));
    if (unanswered.length === 0) return;
    setQuestions(unanswered);
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

    // Persist to localStorage
    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      selected,
      correct,
    };
    const updated = [...answers, record];
    setAnswers(updated);
    saveAnswers(updated);
  }

  function resetProgress() {
    setAnswers([]);
    saveAnswers([]);
    setPhase("idle");
    setQuestions([]);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setSelectedAnswer(null);
    setIsCorrect(null);
  }

  // Review data
  const allQuestions = getQuestionsByDomain(reviewDomain);
  const reviewQuestions = allQuestions.filter((q) => answeredIds.has(q.id));
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));

  const optionKeys = ["A", "B", "C", "D"] as const;
  const isFinished = phase === "answered" && currentIndex + 1 >= totalQuestions;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        <button
          onClick={() => setTab("quiz")}
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
            tab === "quiz"
              ? "text-accent border-b-2 border-accent"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Quiz
        </button>
        <button
          onClick={() => setTab("review")}
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
            tab === "review"
              ? "text-accent border-b-2 border-accent"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Review ({answers.length})
        </button>
      </div>

      {/* ════════════════════════ QUIZ TAB ════════════════════════ */}
      {tab === "quiz" && (
        <>
          {/* Top bar: domain filter + progress + score */}
          <div className="flex items-center justify-between">
            <select
              value={domain}
              onChange={(e) => handleDomainChange(e.target.value)}
              disabled={phase === "question"}
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
              {remainingCount > 0 ? (
                <>
                  <p className="text-text-secondary mb-2">
                    {remainingCount} unanswered question
                    {remainingCount !== 1 ? "s" : ""} remaining
                    {domain !== "All" ? ` in ${domain}` : ""}.
                  </p>
                  <p className="text-text-secondary/60 text-xs mb-6">
                    {answers.length > 0
                      ? `${answers.length}/100 completed overall`
                      : "Questions from all 5 AZ-104 domains"}
                  </p>
                  <button
                    onClick={startQuiz}
                    className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  >
                    {answers.length > 0 ? "Continue Quiz" : "Start Quiz"}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-status-passed font-medium mb-2">
                    All questions completed
                    {domain !== "All" ? ` in ${domain}` : ""}!
                  </p>
                  <p className="text-text-secondary text-sm mb-6">
                    You can review your answers or reset progress to start over.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setTab("review")}
                      className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                      Review Answers
                    </button>
                    <button
                      onClick={resetProgress}
                      className="bg-bg-primary hover:bg-border text-text-secondary px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-border cursor-pointer"
                    >
                      Reset Progress
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Question display */}
          {(phase === "question" || phase === "answered") &&
            currentQuestion && (
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

              <div className="bg-bg-surface border border-border rounded-lg px-5 py-4">
                <p className="text-text-secondary text-sm leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>

              <div className="bg-accent/5 border border-accent/20 rounded-lg px-5 py-3 flex items-start gap-2.5">
                <span className="text-accent text-sm shrink-0">💡</span>
                <p className="text-accent text-sm leading-relaxed">
                  {currentQuestion.tip}
                </p>
              </div>

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
                      Session Complete!
                    </p>
                    <p className="text-text-secondary text-sm mb-4">
                      You scored {score.correct}/{score.total} (
                      {Math.round((score.correct / score.total) * 100)}%)
                    </p>
                    <button
                      onClick={() => {
                        setPhase("idle");
                        setQuestions([]);
                      }}
                      className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                      Back to Quiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ════════════════════════ REVIEW TAB ════════════════════════ */}
      {tab === "review" && (
        <>
          {/* Domain filter + stats */}
          <div className="flex items-center justify-between">
            <select
              value={reviewDomain}
              onChange={(e) => setReviewDomain(e.target.value)}
              className="bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent cursor-pointer"
            >
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d === "All" ? "All Domains" : d}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <span>
                {reviewQuestions.length}/{allQuestions.length} answered
              </span>
              {reviewQuestions.length > 0 && (
                <span>
                  <span className="text-status-passed font-bold">
                    {
                      reviewQuestions.filter(
                        (q) => answerMap.get(q.id)?.correct,
                      ).length
                    }
                  </span>
                  /{reviewQuestions.length} correct
                </span>
              )}
            </div>
          </div>

          {reviewQuestions.length === 0 ? (
            <div className="bg-bg-surface border border-border rounded-lg p-12 text-center">
              <p className="text-text-secondary">
                No answered questions
                {reviewDomain !== "All" ? ` in ${reviewDomain}` : ""} yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviewQuestions.map((q) => {
                const record = answerMap.get(q.id);
                if (!record) return null;

                return (
                  <div
                    key={q.id}
                    className="bg-bg-surface border border-border rounded-lg overflow-hidden"
                  >
                    {/* Header */}
                    <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                      <span className="text-accent text-xs font-semibold uppercase tracking-wider">
                        {q.domain}
                      </span>
                      <span
                        className={`text-xs font-medium ${record.correct ? "text-status-passed" : "text-red-400"}`}
                      >
                        {record.correct ? "Correct" : "Incorrect"}
                      </span>
                    </div>

                    {/* Question */}
                    <div className="px-5 py-4 border-b border-border">
                      <p className="text-text-primary text-sm leading-relaxed">
                        {q.question}
                      </p>
                    </div>

                    {/* Options (compact) */}
                    <div className="px-5 py-3 space-y-1.5">
                      {optionKeys.map((key) => {
                        const isSelected = record.selected === key;
                        const isCorrectOption = q.correct === key;

                        let textColor = "text-text-secondary/50";
                        if (isCorrectOption)
                          textColor = "text-status-passed";
                        else if (isSelected && !isCorrectOption)
                          textColor = "text-red-400";

                        return (
                          <p key={key} className={`text-sm ${textColor}`}>
                            <span className="font-bold">{key}.</span>{" "}
                            {q.options[key]}
                            {isSelected && !isCorrectOption && " ✗"}
                            {isCorrectOption && " ✓"}
                          </p>
                        );
                      })}
                    </div>

                    {/* Explanation + Tip */}
                    <div className="px-5 py-3 border-t border-border space-y-2">
                      <p className="text-text-secondary text-xs leading-relaxed">
                        {q.explanation}
                      </p>
                      <p className="text-accent text-xs">💡 {q.tip}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Reset button */}
          {answers.length > 0 && (
            <div className="flex justify-center pt-2">
              <button
                onClick={resetProgress}
                className="text-text-secondary hover:text-red-400 text-xs transition-colors cursor-pointer"
              >
                Reset all progress
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
