"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findById = findById;
exports.create = create;
exports.update = update;
const mssql_1 = __importDefault(require("mssql"));
const pool_1 = require("../db/pool");
const pathwayColumns = '[id], [title], [description], [createdAt], [updatedAt]';
const courseColumns = '[id], [title], [description], [pathwayId], [createdAt], [updatedAt]';
function mapPathway(row) {
    return { ...row, createdAt: new Date(row.createdAt).toISOString(), updatedAt: new Date(row.updatedAt).toISOString() };
}
function mapCourse(row) {
    return { ...row, createdAt: new Date(row.createdAt).toISOString(), updatedAt: new Date(row.updatedAt).toISOString() };
}
async function findAll() {
    const pool = await (0, pool_1.getDbPool)();
    const result = await pool.request().query(`SELECT ${pathwayColumns} FROM [Pathway] ORDER BY [createdAt] DESC`);
    return result.recordset.map(mapPathway);
}
async function findById(id) {
    const pool = await (0, pool_1.getDbPool)();
    const pathwayResult = await pool.request().input('id', mssql_1.default.Int, id).query(`SELECT ${pathwayColumns} FROM [Pathway] WHERE [id] = @id`);
    const pathway = pathwayResult.recordset[0];
    if (!pathway)
        return undefined;
    const courseResult = await pool.request().input('pathwayId', mssql_1.default.Int, id).query(`SELECT ${courseColumns} FROM [Course] WHERE [pathwayId] = @pathwayId ORDER BY [createdAt] ASC`);
    const courses = courseResult.recordset.map(mapCourse);
    for (const course of courses) {
        const links = await pool.request().input('courseId', mssql_1.default.Int, course.id).query('SELECT [id], [title], [url], [courseId], [createdAt], [updatedAt] FROM [LearningLink] WHERE [courseId] = @courseId ORDER BY [createdAt] ASC');
        course.learningLinks = links.recordset.map((link) => ({ ...link, createdAt: new Date(link.createdAt).toISOString(), updatedAt: new Date(link.updatedAt).toISOString() }));
    }
    return { ...mapPathway(pathway), courses };
}
async function create(data) {
    const pool = await (0, pool_1.getDbPool)();
    const result = await pool.request()
        .input('title', mssql_1.default.NVarChar(1000), data.title)
        .input('description', mssql_1.default.NVarChar(mssql_1.default.MAX), data.description ?? null)
        .query(`INSERT INTO [Pathway] ([title], [description], [createdAt], [updatedAt])
      OUTPUT INSERTED.[id], INSERTED.[title], INSERTED.[description], INSERTED.[createdAt], INSERTED.[updatedAt]
      VALUES (@title, @description, SYSUTCDATETIME(), SYSUTCDATETIME())`);
    return mapPathway(result.recordset[0]);
}
async function update(id, data) {
    const fields = [];
    const request = (await (0, pool_1.getDbPool)()).request().input('id', mssql_1.default.Int, id);
    if (data.title !== undefined) {
        fields.push('[title] = @title');
        request.input('title', mssql_1.default.NVarChar(1000), data.title);
    }
    if (data.description !== undefined) {
        fields.push('[description] = @description');
        request.input('description', mssql_1.default.NVarChar(mssql_1.default.MAX), data.description);
    }
    if (fields.length === 0)
        throw new Error('At least one field is required for update');
    fields.push('[updatedAt] = SYSUTCDATETIME()');
    const result = await request.query(`UPDATE [Pathway] SET ${fields.join(', ')} OUTPUT INSERTED.[id], INSERTED.[title], INSERTED.[description], INSERTED.[createdAt], INSERTED.[updatedAt] WHERE [id] = @id`);
    return result.recordset[0] ? mapPathway(result.recordset[0]) : undefined;
}
//# sourceMappingURL=pathway.repository.js.map