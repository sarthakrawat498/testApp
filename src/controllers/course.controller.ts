import { NextFunction, Request, Response } from 'express';
import * as repository from '../repositories/course.repository';
import { createCourseSchema, updateCourseSchema } from '../validators/course.validator';

export const getAll = async (_request: Request, response: Response, next: NextFunction) => {
  try { response.json(await repository.findAll()); } catch (error) { next(error); }
};

export const getByPathway = async (request: Request, response: Response, next: NextFunction) => {
  try { response.json(await repository.findByPathway(Number(request.params.pathwayId))); } catch (error) { next(error); }
};

export const getById = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const course = await repository.findById(Number(request.params.id));
    if (!course) return response.status(404).json({ message: 'Course not found' });
    course.learningLinks = await repository.findLinksByCourse(course.id);
    response.json(course);
  } catch (error) { next(error); }
};

export const create = async (request: Request, response: Response, next: NextFunction) => {
  const parsed = createCourseSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ errors: parsed.error.errors });
  try { response.status(201).json(await repository.create(parsed.data)); } catch (error) { next(error); }
};

export const update = async (request: Request, response: Response, next: NextFunction) => {
  const parsed = updateCourseSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ errors: parsed.error.errors });
  try {
    const course = await repository.update(Number(request.params.id), parsed.data);
    if (!course) return response.status(404).json({ message: 'Course not found' });
    response.json(course);
  } catch (error) { next(error); }
};