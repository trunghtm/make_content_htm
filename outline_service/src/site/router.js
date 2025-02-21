
import {homPage} from './controller.js';
import {login} from '../auth/auth_controller.js';

import {Router} from 'express';
const site_router = Router();

import {notPublic} from '../http.auth.middleware.js';

/**
 * route for security here
*/
//views api
site_router.get("/login", login);
site_router.get("",notPublic, homPage)

export default site_router;