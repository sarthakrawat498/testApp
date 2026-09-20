"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(error, _request, response, _next) {
    console.error('Request failed', error instanceof Error ? error.message : 'Unknown error');
    response.status(503).json({ message: 'Database service unavailable' });
}
//# sourceMappingURL=errorHandler.js.map