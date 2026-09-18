export type ProjectType = 'long-term' | 'short-term' | 'chores';

export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface Project {
  id: string;
  type: ProjectType;
  name: string;
  description: string;
  createdAt: string;
  status: ProjectStatus;
  color: string;
  completedAt?: string;
  // long-term only
  notes?: string;
  // short-term only
  deadline?: string;
}

export interface Summary {
  id: string;
  projectId: string;
  period: string; // e.g., "2025-W40", "2025-10", "2025-Q2"
  type: 'weekly' | 'monthly' | 'quarterly';
  content: string;
  createdAt: string;
}

export interface AppState {
  projects: Project[];
  summaries: Summary[];
  motto: string;
}
