import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/lib/axios';

// Re-export types
export type { User } from '@/stores/useAuthStore';

export interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  year: number;
  branch: string;
  createdAt: string;
  authorId: string;
  author: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  upvotes: number;
  downvotes: number;
  bestAnswerId: string | null;
  answers: Answer[];
}

export interface Answer {
  id: string;
  content: string;
  questionId: string;
  year: number;
  branch: string;
  createdAt: string;
  authorId: string;
  author: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  upvotes: number;
  downvotes: number;
  bestQuestionId: string | null;
}

export interface CreateQuestionInput {
  title: string;
  content: string;
  tags: string;
}

export interface CreateAnswerInput {
  content: string;
}

/**
 * Get all questions for the current user's batch
 */
export const getQuestions = async () => {
  const response = await axiosClient.get<{ questions: Question[] }>('/academic/questions');
  return response.data.questions;
};

/**
 * Create a new question
 */
export const createQuestion = async (data: CreateQuestionInput) => {
  const response = await axiosClient.post<{ question: Question }>('/academic/questions', data);
  return response.data.question;
};

/**
 * Get question by ID
 */
export const getQuestionById = async (id: string) => {
  const response = await axiosClient.get<{ question: Question }>(`/academic/questions/${id}`);
  return response.data.question;
};

/**
 * Create an answer for a question
 */
export const createAnswer = async (questionId: string, data: CreateAnswerInput) => {
  const response = await axiosClient.post<{ answer: Answer }>(`/academic/questions/${questionId}/answers`, data);
  return response.data.answer;
};

/**
 * Get answers for a question
 */
export const getAnswersByQuestionId = async (questionId: string) => {
  const response = await axiosClient.get<{ answers: Answer[] }>('/academic/questions');
  
  const questions = response.data.questions;
  const question = questions.find(q => q.id === questionId);
  
  if (!question) {
    return [];
  }
  
  return question.answers;
};

/**
 * Delete a question
 */
export const deleteQuestion = async (id: string) => {
  await axiosClient.delete(`/academic/questions/${id}`);
};

/**
 * Vote on a question
 */
export const voteQuestion = async (id: string, voteType: 'upvote' | 'downvote') => {
  await axiosClient.post(`/academic/questions/${id}/vote`, { voteType });
};
/**
 * Delete an answer
 */
export const deleteAnswer = async (questionId: string, answerId: string) => {
  await axiosClient.delete(`/academic/questions/${questionId}/answers/${answerId}`);
};

/**
 * Mark answer as best
 */
export const markBestAnswer = async (questionId: string, answerId: string) => {
  await axiosClient.put(`/academic/questions/${questionId}/best-answer`, { answerId });
};
