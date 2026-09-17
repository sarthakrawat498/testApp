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
export declare const pathways: Pathway[];
export declare const courses: Course[];
export declare const learningLinks: LearningLink[];
//# sourceMappingURL=data.d.ts.map