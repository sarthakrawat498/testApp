"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findByPathway = findByPathway;
exports.findById = findById;
exports.findLinksByCourse = findLinksByCourse;
exports.create = create;
exports.update = update;
const mssql_1 = __importDefault(require("mssql"));
const pool_1 = require("../db/pool");
function mapCourse(row) {
    return { ...row, createdAt: new Date(row.createdAt).toISOString(), updatedAt: new Date(row.updatedAt).toISOString() };
}
function mapLink(row) {
    return { ...row, createdAt: new Date(row.createdAt).toISOString(), updatedAt: new Date(row.updatedAt).toISOString() };
}
async function findAll() {
    const pool = await (0, pool_1.getDbPool)();
    const result = await pool.request().query('SELECT [id], [title], [description], [pathwayId], [createdAt], [updatedAt] FROM [Course] ORDER BY [createdAt] ASC');
    return result.recordset.map(mapCourse);
}
async function findByPathway(pathwayId) {
    const pool = await (0, pool_1.getDbPool)();
    const result = await pool.request().input('pathwayId', mssql_1.default.Int, pathwayId).query('SELECT [id], [title], [description], [pathwayId], [createdAt], [updatedAt] FROM [Course] WHERE [pathwayId] = @pathwayId ORDER BY [createdAt] ASC');
    return result.recordset.map(mapCourse);
}
async function findById(id) {
    const pool = await (0, pool_1.getDbPool)();
    const result = await pool.request().input('id', mssql_1.default.Int, id).query(`SELECT c.[id], c.[title], c.[description], c.[pathwayId], c.[createdAt], c.[updatedAt],
            p.[title] AS [pathwayTitle], p.[description] AS [pathwayDescription], p.[createdAt] AS [pathwayCreatedAt], p.[updatedAt] AS [pathwayUpdatedAt]
     FROM [Course] c INNER JOIN [Pathway] p ON p.[id] = c.[pathwayId] WHERE c.[id] = @id`);
    const row = result.recordset[0];
    if (!row)
        return undefined;
    return {
        ...mapCourse(row),
        pathway: {
            id: row.pathwayId,
            title: row.pathwayTitle,
            description: row.pathwayDescription,
            createdAt: new Date(row.pathwayCreatedAt).toISOString(),
            updatedAt: new Date(row.pathwayUpdatedAt).toISOString()
        }
    };
}
async function findLinksByCourse(courseId) {
    const pool = await (0, pool_1.getDbPool)();
    const result = await pool.request().input('courseId', mssql_1.default.Int, courseId).query('SELECT [id], [title], [url], [courseId], [createdAt], [updatedAt] FROM [LearningLink] WHERE [courseId] = @courseId ORDER BY [createdAt] ASC');
    return result.recordset.map(mapLink);
}
async function create(data) {
    const pool = await (0, pool_1.getDbPool)();
    const result = await pool.request()
        .input('title', mssql_1.default.NVarChar(1000), data.title)
        .input('description', mssql_1.default.NVarChar(mssql_1.default.MAX), data.description ?? null)
        .input('pathwayId', mssql_1.default.Int, data.pathwayId)
        .query(`INSERT INTO [Course] ([title], [description], [pathwayId], [createdAt], [updatedAt])
      OUTPUT INSERTED.[id], INSERTED.[title], INSERTED.[description], INSERTED.[pathwayId], INSERTED.[createdAt], INSERTED.[updatedAt]
      VALUES (@title, @description, @pathwayId, SYSUTCDATETIME(), SYSUTCDATETIME())`);
    return mapCourse(result.recordset[0]);
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
    if (data.pathwayId !== undefined) {
        fields.push('[pathwayId] = @pathwayId');
        request.input('pathwayId', mssql_1.default.Int, data.pathwayId);
    }
    if (fields.length === 0)
        throw new Error('At least one field is required for update');
    fields.push('[updatedAt] = SYSUTCDATETIME()');
    const result = await request.query(`UPDATE [Course] SET ${fields.join(', ')} OUTPUT INSERTED.[id], INSERTED.[title], INSERTED.[description], INSERTED.[pathwayId], INSERTED.[createdAt], INSERTED.[updatedAt] WHERE [id] = @id`);
    return result.recordset[0] ? mapCourse(result.recordset[0]) : undefined;
}
//# sourceMappingURL=course.repository.js.map