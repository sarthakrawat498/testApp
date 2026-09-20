import { NextFunction, Request, Response } from 'express';
import * as repository from '../repositories/learningLink.repository';
import { createLearningLinkSchema, updateLearningLinkSchema } from '../validators/learningLink.validator';

export const getAll = async (_request: Request, response: Response, next: NextFunction) => {
  try { response.json(await repository.findAll()); } catch (error) { next(error); }
};

export const getByCourse = async (request: Request, response: Response, next: NextFunction) => {
  try { response.json(await repository.findByCourse(Number(request.params.courseId))); } catch (error) { next(error); }
};

export const getById = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const link = await repository.findById(Number(request.params.id));
    if (!link) return response.status(404).json({ message: 'Learning link not found' });
    response.json(link);
  } catch (error) { next(error); }
};

export const create = async (request: Request, response: Response, next: NextFunction) => {
  const parsed = createLearningLinkSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ errors: parsed.error.errors });
  try { response.status(201).json(await repository.create(parsed.data)); } catch (error) { next(error); }
};

export const update = async (request: Request, response: Response, next: NextFunction) => {
  const parsed = updateLearningLinkSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ errors: parsed.error.errors });
  try {
    const link = await repository.update(Number(request.params.id), parsed.data);
    if (!link) return response.status(404).json({ message: 'Learning link not found' });
    response.json(link);
  } catch (error) { next(error); }
};