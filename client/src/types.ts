export interface LearningPath {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  isCompleted: boolean;
}

export type Theme = "light" | "dark";
export type ToastType = "success" | "error";

export type SortByOrder = "newest" | "oldest" | "alphabetical";
export type SortByStatus = "all" | "active" | "completed";
