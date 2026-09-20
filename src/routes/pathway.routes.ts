import { Router } from 'express';
import * as controller from '../controllers/pathway.controller';

const router = Router();
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
export default router;