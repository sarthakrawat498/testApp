"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const pool_1 = require("./db/pool");
const errorHandler_1 = require("./middleware/errorHandler");
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const learningLink_routes_1 = __importDefault(require("./routes/learningLink.routes"));
const pathway_routes_1 = __importDefault(require("./routes/pathway.routes"));
const app = (0, express_1.default)();
app.disable('x-powered-by');
const port = Number(process.env.PORT) || 3000;
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express_1.default.json());
app.get('/', (_request, response) => {
    response.type('text/plain').send('Hello there the website is working now');
});
app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok', service: 'backend2' });
});
app.get('/health/database', async (_request, response, next) => {
    try {
        await (0, pool_1.checkDatabaseConnection)();
        response.status(200).json({ status: 'ok', database: 'available' });
    }
    catch (error) {
        next(error);
    }
});
app.use('/api/pathways', pathway_routes_1.default);
app.use('/api/courses', course_routes_1.default);
app.use('/api/learning-links', learningLink_routes_1.default);
app.use(errorHandler_1.errorHandler);
app.use((_request, response) => {
    response.status(404).json({ error: 'Route not found' });
});
app.listen(port, () => {
    console.log(`Backend2 listening on port ${port}`);
});
process.once('SIGTERM', () => { void (0, pool_1.closeDbPool)(); });
process.once('SIGINT', () => { void (0, pool_1.closeDbPool)(); });
exports.default = app;
//# sourceMappingURL=server.js.map