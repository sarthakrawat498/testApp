import sql from 'mssql';
import { getDbPool } from '../db/pool';
import { Course, Pathway, PathwayWithCourses } from '../types/domain';

export interface PathwayInput {
  title?: string;
  description?: string;
}

const pathwayColumns = '[id], [title], [description], [createdAt], [updatedAt]';
const courseColumns = '[id], [title], [description], [pathwayId], [createdAt], [updatedAt]';

function mapPathway(row: Pathway): Pathway {
  return { ...row, createdAt: new Date(row.createdAt).toISOString(), updatedAt: new Date(row.updatedAt).toISOString() };
}

function mapCourse(row: Course): Course {
  return { ...row, createdAt: new Date(row.createdAt).toISOString(), updatedAt: new Date(row.updatedAt).toISOString() };
}

export async function findAll(): Promise<Pathway[]> {
  const pool = await getDbPool();
  const result = await pool.request().query<Pathway>(`SELECT ${pathwayColumns} FROM [Pathway] ORDER BY [createdAt] DESC`);
  return result.recordset.map(mapPathway);
}

export async function findById(id: number): Promise<PathwayWithCourses | undefined> {
  const pool = await getDbPool();
  const pathwayResult = await pool.request().input('id', sql.Int, id).query<Pathway>(`SELECT ${pathwayColumns} FROM [Pathway] WHERE [id] = @id`);
  const pathway = pathwayResult.recordset[0];
  if (!pathway) return undefined;

  const courseResult = await pool.request().input('pathwayId', sql.Int, id).query<Course>(
    `SELECT ${courseColumns} FROM [Course] WHERE [pathwayId] = @pathwayId ORDER BY [createdAt] ASC`
  );
  const courses = courseResult.recordset.map(mapCourse);
  for (const course of courses) {
    const links = await pool.request().input('courseId', sql.Int, course.id).query<{ id: number; title: string; url: string; courseId: number; createdAt: Date; updatedAt: Date }>(
      'SELECT [id], [title], [url], [courseId], [createdAt], [updatedAt] FROM [LearningLink] WHERE [courseId] = @courseId ORDER BY [createdAt] ASC'
    );
    course.learningLinks = links.recordset.map((link) => ({ ...link, createdAt: new Date(link.createdAt).toISOString(), updatedAt: new Date(link.updatedAt).toISOString() }));
  }
  return { ...mapPathway(pathway), courses };
}

export async function create(data: Required<Pick<PathwayInput, 'title'>> & PathwayInput): Promise<Pathway> {
  const pool = await getDbPool();
  const result = await pool.request()
    .input('title', sql.NVarChar(1000), data.title)
    .input('description', sql.NVarChar(sql.MAX), data.description ?? null)
    .query<Pathway>(`INSERT INTO [Pathway] ([title], [description], [createdAt], [updatedAt])
      OUTPUT INSERTED.[id], INSERTED.[title], INSERTED.[description], INSERTED.[createdAt], INSERTED.[updatedAt]
      VALUES (@title, @description, SYSUTCDATETIME(), SYSUTCDATETIME())`);
  return mapPathway(result.recordset[0]);
}

export async function update(id: number, data: PathwayInput): Promise<Pathway | undefined> {
  const fields: string[] = [];
  const request = (await getDbPool()).request().input('id', sql.Int, id);
  if (data.title !== undefined) { fields.push('[title] = @title'); request.input('title', sql.NVarChar(1000), data.title); }
  if (data.description !== undefined) { fields.push('[description] = @description'); request.input('description', sql.NVarChar(sql.MAX), data.description); }
  if (fields.length === 0) throw new Error('At least one field is required for update');
  fields.push('[updatedAt] = SYSUTCDATETIME()');
  const result = await request.query<Pathway>(`UPDATE [Pathway] SET ${fields.join(', ')} OUTPUT INSERTED.[id], INSERTED.[title], INSERTED.[description], INSERTED.[createdAt], INSERTED.[updatedAt] WHERE [id] = @id`);
  return result.recordset[0] ? mapPathway(result.recordset[0]) : undefined;
}