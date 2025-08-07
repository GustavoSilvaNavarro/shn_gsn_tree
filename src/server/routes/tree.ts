import { cloneTree, insertNewNode, retrieveTotalTree } from '@controllers';
import { newNodePayload, payloadCloneNode } from '@interfaces';
import { validateBody } from '@middlewares';
import { Router } from 'express';

const router = Router();

router.get('/tree', retrieveTotalTree);
router.post('/tree', validateBody(newNodePayload), insertNewNode);
router.post('/tree/clone', validateBody(payloadCloneNode), cloneTree);

export default router;
