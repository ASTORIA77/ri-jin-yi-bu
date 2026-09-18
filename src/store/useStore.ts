import { create } from 'zustand';
import { format } from 'date-fns';
import type { Project, ProjectType, ProjectStatus, Summary } from '../types';

const STORAGE_KEY = 'ri-jin-yi-bu-data';

interface DataState {
  projects: Project[];
  summaries: Summary[];
  motto: string;
  // Actions
  loadFromStorage: () => void;
  saveToStorage: () => void;
  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'status'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  completeProject: (id: string) => void;
  archiveProject: (id: string) => void;
  restoreProject: (id: string) => void;
  // Summary actions
  addSummary: (summary: Omit<Summary, 'id' | 'createdAt'>) => void;
  updateSummary: (id: string, content: string) => void;
  deleteSummary: (id: string) => void;
  // Motto
  setMotto: (motto: string) => void;
  // Sample data
  loadSampleData: () => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function loadState(): { projects: Project[]; summaries: Summary[]; motto: string } {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return { projects: [], summaries: [], motto: '' };
}

function saveState(state: { projects: Project[]; summaries: Summary[]; motto: string }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export const useStore = create<DataState>((set, get) => {
  const initial = loadState();

  return {
    projects: initial.projects,
    summaries: initial.summaries,
    motto: initial.motto,

    loadFromStorage: () => {
      const data = loadState();
      set({ projects: data.projects, summaries: data.summaries, motto: data.motto });
    },

    saveToStorage: () => {
      const { projects, summaries, motto } = get();
      saveState({ projects, summaries, motto });
    },

    addProject: (project) => {
      const newProject: Project = {
        ...project,
        id: generateId(),
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      set((state) => ({ projects: [...state.projects, newProject] }));
      get().saveToStorage();
    },

    updateProject: (id, updates) => {
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
      get().saveToStorage();
    },

    deleteProject: (id) => {
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        summaries: state.summaries.filter((s) => s.projectId !== id),
      }));
      get().saveToStorage();
    },

    completeProject: (id) => {
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, status: 'completed' as ProjectStatus, completedAt: new Date().toISOString() } : p
        ),
      }));
      get().saveToStorage();
    },

    archiveProject: (id) => {
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, status: 'archived' as ProjectStatus } : p
        ),
      }));
      get().saveToStorage();
    },

    restoreProject: (id) => {
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, status: 'active' as ProjectStatus } : p
        ),
      }));
      get().saveToStorage();
    },

    addSummary: (summary) => {
      const newSummary: Summary = {
        ...summary,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      set((state) => ({ summaries: [...state.summaries, newSummary] }));
      get().saveToStorage();
    },

    updateSummary: (id, content) => {
      set((state) => ({
        summaries: state.summaries.map((s) => (s.id === id ? { ...s, content } : s)),
      }));
      get().saveToStorage();
    },

    deleteSummary: (id) => {
      set((state) => ({
        summaries: state.summaries.filter((s) => s.id !== id),
      }));
      get().saveToStorage();
    },

    setMotto: (motto) => {
      set({ motto });
      get().saveToStorage();
    },

    loadSampleData: () => {
      const now = new Date();
      const sampleProjects: Project[] = [
        {
          id: generateId(),
          type: 'long-term',
          name: '钢琴练习',
          description: '每天练习钢琴 30 分钟',
          createdAt: new Date(now.getFullYear(), now.getMonth(), 5).toISOString(),
          status: 'active',
          color: '#2563EB',
          notes: '目标：半年内能弹奏肖邦夜曲',
        },
        {
          id: generateId(),
          type: 'long-term',
          name: '阅读计划',
          description: '每月读 2 本书',
          createdAt: new Date(now.getFullYear(), now.getMonth(), 10).toISOString(),
          status: 'active',
          color: '#6366F1',
          notes: '今年目标：24 本',
        },
        {
          id: generateId(),
          type: 'short-term',
          name: '十月读书月',
          description: '完成 4 本书的阅读',
          createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          deadline: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
          status: 'active',
          color: '#3B82F6',
        },
        {
          id: generateId(),
          type: 'short-term',
          name: '完成一篇短文',
          description: '写一篇 2000 字的技术文章',
          createdAt: new Date(now.getFullYear(), now.getMonth(), 15).toISOString(),
          deadline: new Date(now.getFullYear(), now.getMonth(), 25).toISOString().split('T')[0],
          status: 'active',
          color: '#0EA5E9',
        },
        {
          id: generateId(),
          type: 'chores',
          name: '取快递',
          description: '',
          createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString(),
          status: 'active',
          color: '#64748B',
        },
        {
          id: generateId(),
          type: 'chores',
          name: '交电费',
          description: '',
          createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
          status: 'active',
          color: '#64748B',
        },
      ];

      const sampleSummaries: Summary[] = [
        {
          id: generateId(),
          projectId: sampleProjects[0].id,
          period: format(new Date(now.getFullYear(), now.getMonth(), 15), 'yyyy-MM'),
          type: 'monthly',
          content: '本月钢琴练习 progress：学会了新的指法技巧，每天坚持练习 30 分钟。',
          createdAt: new Date(now.getFullYear(), now.getMonth(), 15).toISOString(),
        },
        {
          id: generateId(),
          projectId: sampleProjects[2].id,
          period: format(new Date(now.getFullYear(), now.getMonth(), 20), 'yyyy-MM-dd'),
          type: 'weekly',
          content: '本周读了 1 本书，进度正常。',
          createdAt: new Date(now.getFullYear(), now.getMonth(), 20).toISOString(),
        },
      ];

      set({
        projects: [...get().projects, ...sampleProjects],
        summaries: [...get().summaries, ...sampleSummaries],
        motto: get().motto || '重要的事情没有那么多。',
      });
      get().saveToStorage();
    },
  };
});

// Helper to get projects by type
export const getProjectsByType = (projects: Project[], type: ProjectType) =>
  projects.filter((p) => p.type === type && p.status === 'active');

export const getArchivedProjects = (projects: Project[]) =>
  projects.filter((p) => p.status === 'archived');
