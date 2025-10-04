// Utilitários para Local Storage

const STORAGE_KEYS = {
  QUIZ_PROGRESS: 'myshape_quiz_progress',
  USER_DATA: 'myshape_user_data',
  ASSESSMENT: 'myshape_assessment',
  CURRENT_PAGE: 'myshape_current_page'
} as const;

export class StorageManager {
  // Quiz Progress
  static saveQuizProgress(currentStep: number, answers: Record<string, any>) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify({
        currentStep,
        answers,
        timestamp: Date.now()
      }));
    }
  }

  static getQuizProgress(): { currentStep: number; answers: Record<string, any> } | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  static clearQuizProgress() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.QUIZ_PROGRESS);
    }
  }

  // User Data
  static saveUserData(userData: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    }
  }

  static getUserData() {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  // Assessment
  static saveAssessment(assessment: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT, JSON.stringify(assessment));
    }
  }

  static getAssessment() {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  // Current Page
  static saveCurrentPage(page: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, page);
    }
  }

  static getCurrentPage(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE);
    }
    return null;
  }

  // Clear all data
  static clearAllData() {
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  }
}