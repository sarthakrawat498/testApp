import { NextFunction, Request, Response } from 'express';

export function errorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction): void {
  console.error('Request failed', error instanceof Error ? error.message : 'Unknown error');
  response.status(503).json({ message: 'Database service unavailable' });
}