"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePathwaySchema = exports.createPathwaySchema = void 0;
const zod_1 = require("zod");
exports.createPathwaySchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().optional()
});
exports.updatePathwaySchema = exports.createPathwaySchema.partial();
//# sourceMappingURL=pathway.validator.js.map