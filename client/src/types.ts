export interface LearningPath {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export type Theme = "light" | "dark";
export type ToastType = "success" | "error";
export type SortOption = "newest" | "oldest" | "alphabetical";
