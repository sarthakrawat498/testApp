"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = exports.getById = exports.getAll = void 0;
const repository = __importStar(require("../repositories/pathway.repository"));
const pathway_validator_1 = require("../validators/pathway.validator");
const getAll = async (_request, response, next) => {
    try {
        response.json(await repository.findAll());
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getById = async (request, response, next) => {
    try {
        const pathway = await repository.findById(Number(request.params.id));
        if (!pathway)
            return response.status(404).json({ message: 'Pathway not found' });
        response.json(pathway);
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
const create = async (request, response, next) => {
    const parsed = pathway_validator_1.createPathwaySchema.safeParse(request.body);
    if (!parsed.success)
        return response.status(400).json({ errors: parsed.error.errors });
    try {
        response.status(201).json(await repository.create(parsed.data));
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const update = async (request, response, next) => {
    const parsed = pathway_validator_1.updatePathwaySchema.safeParse(request.body);
    if (!parsed.success)
        return response.status(400).json({ errors: parsed.error.errors });
    try {
        const pathway = await repository.update(Number(request.params.id), parsed.data);
        if (!pathway)
            return response.status(404).json({ message: 'Pathway not found' });
        response.json(pathway);
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
//# sourceMappingURL=pathway.controller.js.map