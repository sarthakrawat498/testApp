import sql from 'mssql';
import { getDbPool } from '../db/pool';
import { LearningLink } from '../types/domain';

export interface LearningLinkInput {
  title?: string;
  url?: string;
  courseId?: number;
}

function map(row: LearningLink): LearningLink {
  return { ...row, createdAt: new Date(row.createdAt).toISOString(), updatedAt: new Date(row.updatedAt).toISOString() };
}

export async function findAll(): Promise<LearningLink[]> {
  const pool = await getDbPool();
  const result = await pool.request().query<LearningLink>('SELECT [id], [title], [url], [courseId], [createdAt], [updatedAt] FROM [LearningLink] ORDER BY [createdAt] ASC');
  return result.recordset.map(map);
}

export async function findById(id: number): Promise<LearningLink | undefined> {
  const pool = await getDbPool();
  const result = await pool.request().input('id', sql.Int, id).query<LearningLink>('SELECT [id], [title], [url], [courseId], [createdAt], [updatedAt] FROM [LearningLink] WHERE [id] = @id');
  return result.recordset[0] ? map(result.recordset[0]) : undefined;
}

export async function findByCourse(courseId: number): Promise<LearningLink[]> {
  const pool = await getDbPool();
  const result = await pool.request().input('courseId', sql.Int, courseId).query<LearningLink>('SELECT [id], [title], [url], [courseId], [createdAt], [updatedAt] FROM [LearningLink] WHERE [courseId] = @courseId ORDER BY [createdAt] ASC');
  return result.recordset.map(map);
}

export async function create(data: Required<Pick<LearningLinkInput, 'title' | 'url' | 'courseId'>>): Promise<LearningLink> {
  const pool = await getDbPool();
  const result = await pool.request()
    .input('title', sql.NVarChar(1000), data.title)
    .input('url', sql.NVarChar(sql.MAX), data.url)
    .input('courseId', sql.Int, data.courseId)
    .query<LearningLink>(`INSERT INTO [LearningLink] ([title], [url], [courseId], [createdAt], [updatedAt])
      OUTPUT INSERTED.[id], INSERTED.[title], INSERTED.[url], INSERTED.[courseId], INSERTED.[createdAt], INSERTED.[updatedAt]
      VALUES (@title, @url, @courseId, SYSUTCDATETIME(), SYSUTCDATETIME())`);
  return map(result.recordset[0]);
}

export async function update(id: number, data: LearningLinkInput): Promise<LearningLink | undefined> {
  const fields: string[] = [];
  const request = (await getDbPool()).request().input('id', sql.Int, id);
  if (data.title !== undefined) { fields.push('[title] = @title'); request.input('title', sql.NVarChar(1000), data.title); }
  if (data.url !== undefined) { fields.push('[url] = @url'); request.input('url', sql.NVarChar(sql.MAX), data.url); }
  if (data.courseId !== undefined) { fields.push('[courseId] = @courseId'); request.input('courseId', sql.Int, data.courseId); }
  if (fields.length === 0) throw new Error('At least one field is required for update');
  fields.push('[updatedAt] = SYSUTCDATETIME()');
  const result = await request.query<LearningLink>(`UPDATE [LearningLink] SET ${fields.join(', ')} OUTPUT INSERTED.[id], INSERTED.[title], INSERTED.[url], INSERTED.[courseId], INSERTED.[createdAt], INSERTED.[updatedAt] WHERE [id] = @id`);
  return result.recordset[0] ? map(result.recordset[0]) : undefined;
}