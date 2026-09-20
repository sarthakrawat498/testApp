"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findById = findById;
exports.findByCourse = findByCourse;
exports.create = create;
exports.update = update;
const mssql_1 = __importDefault(require("mssql"));
const pool_1 = require("../db/pool");
function map(row) {
    return { ...row, createdAt: new Date(row.createdAt).toISOString(), updatedAt: new Date(row.updatedAt).toISOString() };
}
async function findAll() {
    const pool = await (0, pool_1.getDbPool)();
    const result = await pool.request().query('SELECT [id], [title], [url], [courseId], [createdAt], [updatedAt] FROM [LearningLink] ORDER BY [createdAt] ASC');
    return result.recordset.map(map);
}
async function findById(id) {
    const pool = await (0, pool_1.getDbPool)();
    const result = await pool.request().input('id', mssql_1.default.Int, id).query('SELECT [id], [title], [url], [courseId], [createdAt], [updatedAt] FROM [LearningLink] WHERE [id] = @id');
    return result.recordset[0] ? map(result.recordset[0]) : undefined;
}
async function findByCourse(courseId) {
    const pool = await (0, pool_1.getDbPool)();
    const result = await pool.request().input('courseId', mssql_1.default.Int, courseId).query('SELECT [id], [title], [url], [courseId], [createdAt], [updatedAt] FROM [LearningLink] WHERE [courseId] = @courseId ORDER BY [createdAt] ASC');
    return result.recordset.map(map);
}
async function create(data) {
    const pool = await (0, pool_1.getDbPool)();
    const result = await pool.request()
        .input('title', mssql_1.default.NVarChar(1000), data.title)
        .input('url', mssql_1.default.NVarChar(mssql_1.default.MAX), data.url)
        .input('courseId', mssql_1.default.Int, data.courseId)
        .query(`INSERT INTO [LearningLink] ([title], [url], [courseId], [createdAt], [updatedAt])
      OUTPUT INSERTED.[id], INSERTED.[title], INSERTED.[url], INSERTED.[courseId], INSERTED.[createdAt], INSERTED.[updatedAt]
      VALUES (@title, @url, @courseId, SYSUTCDATETIME(), SYSUTCDATETIME())`);
    return map(result.recordset[0]);
}
async function update(id, data) {
    const fields = [];
    const request = (await (0, pool_1.getDbPool)()).request().input('id', mssql_1.default.Int, id);
    if (data.title !== undefined) {
        fields.push('[title] = @title');
        request.input('title', mssql_1.default.NVarChar(1000), data.title);
    }
    if (data.url !== undefined) {
        fields.push('[url] = @url');
        request.input('url', mssql_1.default.NVarChar(mssql_1.default.MAX), data.url);
    }
    if (data.courseId !== undefined) {
        fields.push('[courseId] = @courseId');
        request.input('courseId', mssql_1.default.Int, data.courseId);
    }
    if (fields.length === 0)
        throw new Error('At least one field is required for update');
    fields.push('[updatedAt] = SYSUTCDATETIME()');
    const result = await request.query(`UPDATE [LearningLink] SET ${fields.join(', ')} OUTPUT INSERTED.[id], INSERTED.[title], INSERTED.[url], INSERTED.[courseId], INSERTED.[createdAt], INSERTED.[updatedAt] WHERE [id] = @id`);
    return result.recordset[0] ? map(result.recordset[0]) : undefined;
}
//# sourceMappingURL=learningLink.repository.js.map