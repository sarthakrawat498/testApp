import { z } from 'zod';
export declare const createLearningLinkSchema: z.ZodObject<{
    title: z.ZodString;
    url: z.ZodEffects<z.ZodString, string, string>;
    courseId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    courseId: number;
    title: string;
    url: string;
}, {
    courseId: number;
    title: string;
    url: string;
}>;
export declare const updateLearningLinkSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    courseId: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    courseId?: number | undefined;
    title?: string | undefined;
    url?: string | undefined;
}, {
    courseId?: number | undefined;
    title?: string | undefined;
    url?: string | undefined;
}>;
//# sourceMappingURL=learningLink.validator.d.ts.map