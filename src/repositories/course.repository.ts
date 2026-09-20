import sql from 'mssql';
import { getDbPool } from '../db/pool';
import { Course, CourseWithPathway, LearningLink } from '../types/domain';

export interface CourseInput {
  title?: string;
  description?: string;
  pathwayId?: number;
}

function mapCourse(row: Course): Course {
  return { ...row, createdAt: new Date(row.createdAt).toISOString(), updatedAt: new Date(row.updatedAt).toISOString() };
}

function mapLink(row: LearningLink): LearningLink {
  return { ...row, createdAt: new Date(row.createdAt).toISOString(), updatedAt: new Date(row.updatedAt).toISOString() };
}

export async function findAll(): Promise<Course[]> {
  const pool = await getDbPool();
  const result = await pool.request().query<Course>('SELECT [id], [title], [description], [pathwayId], [createdAt], [updatedAt] FROM [Course] ORDER BY [createdAt] ASC');
  return result.recordset.map(mapCourse);
}

export async function findByPathway(pathwayId: number): Promise<Course[]> {
  const pool = await getDbPool();
  const result = await pool.request().input('pathwayId', sql.Int, pathwayId).query<Course>(
    'SELECT [id], [title], [description], [pathwayId], [createdAt], [updatedAt] FROM [Course] WHERE [pathwayId] = @pathwayId ORDER BY [createdAt] ASC'
  );
  return result.recordset.map(mapCourse);
}

export async function findById(id: number): Promise<CourseWithPathway | undefined> {
  const pool = await getDbPool();
  const result = await pool.request().input('id', sql.Int, id).query<Course & { pathwayTitle: string; pathwayDescription: string | null; pathwayCreatedAt: Date; pathwayUpdatedAt: Date }>(
    `SELECT c.[id], c.[title], c.[description], c.[pathwayId], c.[createdAt], c.[updatedAt],
            p.[title] AS [pathwayTitle], p.[description] AS [pathwayDescription], p.[createdAt] AS [pathwayCreatedAt], p.[updatedAt] AS [pathwayUpdatedAt]
     FROM [Course] c INNER JOIN [Pathway] p ON p.[id] = c.[pathwayId] WHERE c.[id] = @id`
  );
  const row = result.recordset[0];
  if (!row) return undefined;
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

export async function findLinksByCourse(courseId: number): Promise<LearningLink[]> {
  const pool = await getDbPool();
  const result = await pool.request().input('courseId', sql.Int, courseId).query<LearningLink>(
    'SELECT [id], [title], [url], [courseId], [createdAt], [updatedAt] FROM [LearningLink] WHERE [courseId] = @courseId ORDER BY [createdAt] ASC'
  );
  return result.recordset.map(mapLink);
}

export async function create(data: Required<Pick<CourseInput, 'title' | 'pathwayId'>> & CourseInput): Promise<Course> {
  const pool = await getDbPool();
  const result = await pool.request()
    .input('title', sql.NVarChar(1000), data.title)
    .input('description', sql.NVarChar(sql.MAX), data.description ?? null)
    .input('pathwayId', sql.Int, data.pathwayId)
    .query<Course>(`INSERT INTO [Course] ([title], [description], [pathwayId], [createdAt], [updatedAt])
      OUTPUT INSERTED.[id], INSERTED.[title], INSERTED.[description], INSERTED.[pathwayId], INSERTED.[createdAt], INSERTED.[updatedAt]
      VALUES (@title, @description, @pathwayId, SYSUTCDATETIME(), SYSUTCDATETIME())`);
  return mapCourse(result.recordset[0]);
}

export async function update(id: number, data: CourseInput): Promise<Course | undefined> {
  const fields: string[] = [];
  const request = (await getDbPool()).request().input('id', sql.Int, id);
  if (data.title !== undefined) { fields.push('[title] = @title'); request.input('title', sql.NVarChar(1000), data.title); }
  if (data.description !== undefined) { fields.push('[description] = @description'); request.input('description', sql.NVarChar(sql.MAX), data.description); }
  if (data.pathwayId !== undefined) { fields.push('[pathwayId] = @pathwayId'); request.input('pathwayId', sql.Int, data.pathwayId); }
  if (fields.length === 0) throw new Error('At least one field is required for update');
  fields.push('[updatedAt] = SYSUTCDATETIME()');
  const result = await request.query<Course>(`UPDATE [Course] SET ${fields.join(', ')} OUTPUT INSERTED.[id], INSERTED.[title], INSERTED.[description], INSERTED.[pathwayId], INSERTED.[createdAt], INSERTED.[updatedAt] WHERE [id] = @id`);
  return result.recordset[0] ? mapCourse(result.recordset[0]) : undefined;
}