import { insertNewNode, retrieveTotalTree } from '@controllers';
import { newNodePayload } from '@interfaces';
import { validateBody } from '@middlewares';
import { Router } from 'express';

const router = Router();

router.get('/tree', retrieveTotalTree);
router.post('/tree', validateBody(newNodePayload), insertNewNode);

export default router;
