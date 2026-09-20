import { Router } from 'express';
import * as controller from '../controllers/learningLink.controller';

const router = Router();
router.get('/', controller.getAll);
router.get('/course/:courseId', controller.getByCourse);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
export default router;