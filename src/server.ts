import cors from 'cors';
import express from 'express';
import { courses, learningLinks, pathways } from './data';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json());

app.get('/', (_request, response) => {
  response.type('text/plain').send('yes hello website working');
});

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok', service: 'backend2' });
});

app.get('/api/pathways', (_request, response) => {
  response.json(pathways);
});

app.get('/api/courses', (_request, response) => {
  response.json(courses);
});

app.get('/api/learning-links', (_request, response) => {
  response.json(learningLinks);
});

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Backend2 listening on port ${port}`);
});

export default app;
