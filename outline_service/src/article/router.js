
import {Router} from 'express';
import {make_article} from './article-crud.js';
const article_router = Router();

/**
 * route for security here
*/
article_router.post("/make-ads", make_article);

export default article_router;