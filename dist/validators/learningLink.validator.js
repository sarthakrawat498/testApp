"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLearningLinkSchema = exports.createLearningLinkSchema = void 0;
const zod_1 = require("zod");
exports.createLearningLinkSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    url: zod_1.z.string().refine((value) => {
        try {
            new URL(value);
            return true;
        }
        catch {
            return false;
        }
    }, 'Must be a valid URL'),
    courseId: zod_1.z.number().int().positive()
});
exports.updateLearningLinkSchema = exports.createLearningLinkSchema.partial();
//# sourceMappingURL=learningLink.validator.js.map