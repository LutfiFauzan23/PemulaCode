import { create } from 'zustand';

export type ModuleStatus = 'available' | 'in_progress' | 'locked' | 'completed' | 'coming_soon';

export type ModuleProgressState = {
  id: string;
  courseId: string;
  status: ModuleStatus;
  progress: number;
  quizCompleted: boolean;
};

type CourseModuleMap = Record<string, ModuleProgressState>;

type ProgressState = {
  modules: CourseModuleMap;
  completeQuiz: (courseId: string, moduleId: string) => void;
  updateModuleProgress: (courseId: string, moduleId: string, progress: number) => void;
  resetProgress: () => void;
  getCourseProgress: (courseId: string) => number;
  getOverallProgress: () => number;
};

const INITIAL_MODULES: CourseModuleMap = {
  // HTML Modules
  'html-01': { id: 'html-01', courseId: 'html', status: 'available', progress: 0, quizCompleted: false },
  'html-02': { id: 'html-02', courseId: 'html', status: 'locked', progress: 0, quizCompleted: false },
  'html-03': { id: 'html-03', courseId: 'html', status: 'coming_soon', progress: 0, quizCompleted: false },

  // CSS Modules
  'css-01': { id: 'css-01', courseId: 'css', status: 'available', progress: 0, quizCompleted: false },
  'css-02': { id: 'css-02', courseId: 'css', status: 'locked', progress: 0, quizCompleted: false },
  'css-03': { id: 'css-03', courseId: 'css', status: 'coming_soon', progress: 0, quizCompleted: false },

  // JavaScript Modules
  'js-01': { id: 'js-01', courseId: 'javascript', status: 'available', progress: 0, quizCompleted: false },
  'js-02': { id: 'js-02', courseId: 'javascript', status: 'locked', progress: 0, quizCompleted: false },
  'js-03': { id: 'js-03', courseId: 'javascript', status: 'coming_soon', progress: 0, quizCompleted: false },
};

const NEXT_MODULE_MAP: Record<string, string> = {
  'html-01': 'html-02',
  'css-01': 'css-02',
  'js-01': 'js-02',
};

function normalizeModuleId(id: string): string {
  if (!id) return '';
  let norm = id.toLowerCase().trim();
  if (norm === 'html-module-1' || norm === 'html-1') return 'html-01';
  if (norm === 'html-module-2' || norm === 'html-2') return 'html-02';
  if (norm === 'html-module-3' || norm === 'html-3') return 'html-03';
  if (norm === 'css-module-1' || norm === 'css-1') return 'css-01';
  if (norm === 'css-module-2' || norm === 'css-2') return 'css-02';
  if (norm === 'css-module-3' || norm === 'css-3') return 'css-03';
  if (norm === 'javascript-module-1' || norm === 'js-module-1' || norm === 'js-1') return 'js-01';
  if (norm === 'javascript-module-2' || norm === 'js-module-2' || norm === 'js-2') return 'js-02';
  if (norm === 'javascript-module-3' || norm === 'js-module-3' || norm === 'js-3') return 'js-03';
  return norm;
}

function normalizeCourseId(id: string): string {
  if (!id) return '';
  let norm = id.toLowerCase().trim();
  if (norm === 'js') return 'javascript';
  return norm;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  modules: INITIAL_MODULES,

  completeQuiz: (courseId: string, moduleId: string) => {
    const targetModuleId = normalizeModuleId(moduleId);
    set((state) => {
      const updated = { ...state.modules };
      if (updated[targetModuleId]) {
        updated[targetModuleId] = {
          ...updated[targetModuleId],
          status: 'completed',
          progress: 100,
          quizCompleted: true,
        };
      }

      // Unlock next module if present
      const nextId = NEXT_MODULE_MAP[targetModuleId];
      if (nextId && updated[nextId] && updated[nextId].status === 'locked') {
        updated[nextId] = {
          ...updated[nextId],
          status: 'available',
          progress: 0,
        };
      }

      return { modules: updated };
    });
  },

  updateModuleProgress: (courseId: string, moduleId: string, progress: number) => {
    const targetModuleId = normalizeModuleId(moduleId);
    set((state) => {
      const updated = { ...state.modules };
      const current = updated[targetModuleId];
      if (current && current.status !== 'completed' && current.status !== 'coming_soon' && current.status !== 'locked') {
        const newProgress = Math.min(100, Math.max(current.progress, progress));
        updated[targetModuleId] = {
          ...current,
          progress: newProgress,
          status: newProgress > 0 ? 'in_progress' : 'available',
        };
      }
      return { modules: updated };
    });
  },

  resetProgress: () => {
    set({ modules: INITIAL_MODULES });
  },

  getCourseProgress: (courseId: string) => {
    const normCourse = normalizeCourseId(courseId);
    const modules = get().modules;
    const courseModules = Object.values(modules).filter(
      (m) => m.courseId === normCourse && m.status !== 'coming_soon'
    );
    if (courseModules.length === 0) return 0;
    const completedCount = courseModules.filter((m) => m.quizCompleted || m.status === 'completed').length;
    return Math.round((completedCount / courseModules.length) * 100);
  },

  getOverallProgress: () => {
    const modules = get().modules;
    const availableModules = Object.values(modules).filter((m) => m.status !== 'coming_soon');
    if (availableModules.length === 0) return 0;
    const completedCount = availableModules.filter((m) => m.quizCompleted || m.status === 'completed').length;
    return Math.round((completedCount / availableModules.length) * 100);
  },
}));
