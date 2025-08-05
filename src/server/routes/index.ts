import { Router } from 'express';

import monitoringRoutes from './monitoring';
import treeRoutes from './tree';

const router = Router();

router.use(monitoringRoutes);
router.use('/api', treeRoutes);

export default router;
