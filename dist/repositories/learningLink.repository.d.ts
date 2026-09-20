import { LearningLink } from '../types/domain';
export interface LearningLinkInput {
    title?: string;
    url?: string;
    courseId?: number;
}
export declare function findAll(): Promise<LearningLink[]>;
export declare function findById(id: number): Promise<LearningLink | undefined>;
export declare function findByCourse(courseId: number): Promise<LearningLink[]>;
export declare function create(data: Required<Pick<LearningLinkInput, 'title' | 'url' | 'courseId'>>): Promise<LearningLink>;
export declare function update(id: number, data: LearningLinkInput): Promise<LearningLink | undefined>;
//# sourceMappingURL=learningLink.repository.d.ts.map