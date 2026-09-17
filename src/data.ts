export interface Pathway {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  pathwayId: number;
  createdAt: string;
  updatedAt: string;
}

export interface LearningLink {
  id: number;
  title: string;
  url: string;
  courseId: number;
  createdAt: string;
  updatedAt: string;
}

const timestamp = '2026-01-01T00:00:00.000Z';

export const pathways: Pathway[] = [
  {
    id: 1,
    title: 'Web Development',
    description: 'Build modern web applications from frontend to backend.',
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 2,
    title: 'Cloud Fundamentals',
    description: 'Learn the core concepts behind cloud application delivery.',
    createdAt: timestamp,
    updatedAt: timestamp
  }
];

export const courses: Course[] = [
  {
    id: 1,
    title: 'TypeScript Essentials',
    description: 'Learn types, interfaces, and practical TypeScript patterns.',
    pathwayId: 1,
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 2,
    title: 'Azure App Service Basics',
    description: 'Deploy and operate a web API on Azure App Service.',
    pathwayId: 2,
    createdAt: timestamp,
    updatedAt: timestamp
  }
];

export const learningLinks: LearningLink[] = [
  {
    id: 1,
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    courseId: 1,
    createdAt: timestamp,
    updatedAt: timestamp
  },
  {
    id: 2,
    title: 'Azure App Service Documentation',
    url: 'https://learn.microsoft.com/azure/app-service/',
    courseId: 2,
    createdAt: timestamp,
    updatedAt: timestamp
  }
];
