import { monitoringController } from '@controllers';
import { Router } from 'express';

const router = Router();

router.get('/healthz', monitoringController);

export default router;
