import { Router } from 'express';

import monitoringRoutes from './monitoring';

const router = Router();

router.use(monitoringRoutes);

export default router;
