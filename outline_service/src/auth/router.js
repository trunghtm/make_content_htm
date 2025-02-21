import {authentication} from './auth_controller.js';

import {Router} from 'express';
const auth_router = Router();

/**
 * route for security here
*/
auth_router.post("/", authentication);

export default auth_router;