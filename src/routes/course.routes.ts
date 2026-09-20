import { Router } from 'express';
import * as controller from '../controllers/course.controller';

const router = Router();
router.get('/', controller.getAll);
router.get('/pathway/:pathwayId', controller.getByPathway);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
export default router;