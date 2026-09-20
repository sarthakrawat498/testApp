import { Course, CourseWithPathway, LearningLink } from '../types/domain';
export interface CourseInput {
    title?: string;
    description?: string;
    pathwayId?: number;
}
export declare function findAll(): Promise<Course[]>;
export declare function findByPathway(pathwayId: number): Promise<Course[]>;
export declare function findById(id: number): Promise<CourseWithPathway | undefined>;
export declare function findLinksByCourse(courseId: number): Promise<LearningLink[]>;
export declare function create(data: Required<Pick<CourseInput, 'title' | 'pathwayId'>> & CourseInput): Promise<Course>;
export declare function update(id: number, data: CourseInput): Promise<Course | undefined>;
//# sourceMappingURL=course.repository.d.ts.map