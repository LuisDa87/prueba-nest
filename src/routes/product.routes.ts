import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', verifyJWT, ProductController.list);
router.post('/', verifyJWT, requireRole('admin'), ProductController.create);

export default router;

