import { z } from 'zod';
export declare const createCourseSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    pathwayId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    pathwayId: number;
    title: string;
    description?: string | undefined;
}, {
    pathwayId: number;
    title: string;
    description?: string | undefined;
}>;
export declare const updateCourseSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    pathwayId: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    pathwayId?: number | undefined;
    title?: string | undefined;
    description?: string | undefined;
}, {
    pathwayId?: number | undefined;
    title?: string | undefined;
    description?: string | undefined;
}>;
//# sourceMappingURL=course.validator.d.ts.map