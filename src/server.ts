import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import { checkDatabaseConnection, closeDbPool } from './db/pool';
import { errorHandler } from './middleware/errorHandler';
import courseRoutes from './routes/course.routes';
import learningLinkRoutes from './routes/learningLink.routes';
import pathwayRoutes from './routes/pathway.routes';

const app = express();
app.disable('x-powered-by');
const port = Number(process.env.PORT) || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (_request, response) => {
  response.type('text/plain').send('Hello there the website is working now');
});

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok', service: 'backend2' });
});

app.get('/health/database', async (_request, response, next) => {
  try {
    await checkDatabaseConnection();
    response.status(200).json({ status: 'ok', database: 'available' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/pathways', pathwayRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/learning-links', learningLinkRoutes);

app.use(errorHandler);

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Backend2 listening on port ${port}`);
});

process.once('SIGTERM', () => { void closeDbPool(); });
process.once('SIGINT', () => { void closeDbPool(); });

export default app;
