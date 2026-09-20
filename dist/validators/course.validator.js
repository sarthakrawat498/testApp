"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseSchema = exports.createCourseSchema = void 0;
const zod_1 = require("zod");
exports.createCourseSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().optional(),
    pathwayId: zod_1.z.number().int().positive()
});
exports.updateCourseSchema = exports.createCourseSchema.partial();
//# sourceMappingURL=course.validator.js.map