"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const data_1 = require("./data");
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3000;
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL || true }));
app.use(express_1.default.json());
app.get('/', (_request, response) => {
    response.type('text/plain').send('yes hello website working');
});
app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok', service: 'backend2' });
});
app.get('/api/pathways', (_request, response) => {
    response.json(data_1.pathways);
});
app.get('/api/courses', (_request, response) => {
    response.json(data_1.courses);
});
app.get('/api/learning-links', (_request, response) => {
    response.json(data_1.learningLinks);
});
app.use((_request, response) => {
    response.status(404).json({ error: 'Route not found' });
});
app.listen(port, () => {
    console.log(`Backend2 listening on port ${port}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map