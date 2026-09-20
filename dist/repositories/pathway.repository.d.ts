import { Pathway, PathwayWithCourses } from '../types/domain';
export interface PathwayInput {
    title?: string;
    description?: string;
}
export declare function findAll(): Promise<Pathway[]>;
export declare function findById(id: number): Promise<PathwayWithCourses | undefined>;
export declare function create(data: Required<Pick<PathwayInput, 'title'>> & PathwayInput): Promise<Pathway>;
export declare function update(id: number, data: PathwayInput): Promise<Pathway | undefined>;
//# sourceMappingURL=pathway.repository.d.ts.map