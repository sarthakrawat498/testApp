import { NextFunction, Request, Response } from 'express';
export declare const getAll: (_request: Request, response: Response, next: NextFunction) => Promise<void>;
export declare const getById: (request: Request, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const create: (request: Request, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const update: (request: Request, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=pathway.controller.d.ts.map