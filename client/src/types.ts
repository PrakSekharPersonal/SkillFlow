export interface Milestone {
  id: number;
  title: string;
  isCompleted: boolean;
  learningPathId: number;
}

export interface ResourceLink {
  id: number;
  title: string;
  url: string;
  learningPathId: number;
}

export interface LearningPath {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  isCompleted: boolean;
  milestones?: Milestone[];
  resourceLinks?: ResourceLink[];
}

export type Theme = "light" | "dark";
export type ToastType = "success" | "error";

export type SortByOrder = "newest" | "oldest" | "alphabetical";
export type SortByStatus = "all" | "active" | "completed";
