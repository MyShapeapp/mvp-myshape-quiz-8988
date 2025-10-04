// Tipos para o MyShape MVP

export interface User {
  id: string;
  name: string;
  email: string;
  gender: 'male' | 'female';
  createdAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'select' | 'range' | 'multiselect';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  images?: string[]; // URLs das imagens para a pergunta
}

export interface QuizAnswer {
  questionId: string;
  answer: string | number | string[];
}

export interface Assessment {
  id: string;
  userId: string;
  answers: QuizAnswer[];
  tags: string[];
  completedAt: Date;
}

export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
  summary: string;
  fullProgram: {
    workouts: Workout[];
    nutrition: NutritionPlan;
    tips: string[];
  };
}

export interface Workout {
  day: string;
  exercises: Exercise[];
  duration: number;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  instructions: string;
}

export interface NutritionPlan {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: Meal[];
}

export interface Meal {
  name: string;
  time: string;
  foods: string[];
  calories: number;
}

export type AppPage = 'landing' | 'quiz' | 'preview' | 'checkout' | 'dashboard';