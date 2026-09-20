import { NextFunction, Request, Response } from 'express';
import * as repository from '../repositories/pathway.repository';
import { createPathwaySchema, updatePathwaySchema } from '../validators/pathway.validator';

export const getAll = async (_request: Request, response: Response, next: NextFunction) => {
  try { response.json(await repository.findAll()); } catch (error) { next(error); }
};

export const getById = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const pathway = await repository.findById(Number(request.params.id));
    if (!pathway) return response.status(404).json({ message: 'Pathway not found' });
    response.json(pathway);
  } catch (error) { next(error); }
};

export const create = async (request: Request, response: Response, next: NextFunction) => {
  const parsed = createPathwaySchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ errors: parsed.error.errors });
  try { response.status(201).json(await repository.create(parsed.data)); } catch (error) { next(error); }
};

export const update = async (request: Request, response: Response, next: NextFunction) => {
  const parsed = updatePathwaySchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ errors: parsed.error.errors });
  try {
    const pathway = await repository.update(Number(request.params.id), parsed.data);
    if (!pathway) return response.status(404).json({ message: 'Pathway not found' });
    response.json(pathway);
  } catch (error) { next(error); }
};