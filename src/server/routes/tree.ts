import { insertNewNode, retrieveTotalTree } from '@controllers';
import { Router } from 'express';

const router = Router();

router.get('/tree', retrieveTotalTree);
router.post('/tree', insertNewNode);

export default router;
