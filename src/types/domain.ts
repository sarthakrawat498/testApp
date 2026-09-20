export interface Pathway {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: number;
  title: string;
  description: string | null;
  pathwayId: number;
  createdAt: string;
  updatedAt: string;
  learningLinks?: LearningLink[];
}

export interface LearningLink {
  id: number;
  title: string;
  url: string;
  courseId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PathwayWithCourses extends Pathway {
  courses: Course[];
}

export interface CourseWithPathway extends Course {
  pathway: Pathway;
}